from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
from backend.database import get_db
from pathlib import Path
import uuid
import shutil
import json
from io import BytesIO
import unicodedata
from backend.models import Grado, Asignatura, Periodo, Estudiante, Calificacion, DuracionClase, Asistencia, Tarea, TareaEstudiante, Estandar, AsignaturaGrado, Dba 
from weasyprint import HTML
from datetime import datetime, date
from fastapi.responses import StreamingResponse
from fastapi import Body, HTTPException
from io import BytesIO
from backend.schemas import BoletinCompletoResponse
import qrcode
import base64



router = APIRouter(prefix="/api", tags=["docente"])

@router.get("/grados", summary="Obtener lista de grados")
def get_grados(db: Session = Depends(get_db)):
    try:
        grados = db.execute(select(Grado).order_by(Grado.id)).scalars().all()
        return [{"id": g.id, "nombre": g.nombre} for g in grados]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/asignaturas", summary="Obtener lista de asignaturas")
def get_asignaturas(db: Session = Depends(get_db)):
    try:
        asignaturas = db.execute(select(Asignatura).order_by(Asignatura.name)).scalars().all()
        return [{"id": a.subject_id, "nombre": a.name} for a in asignaturas]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/periodos", summary="Obtener lista de periodos")
def get_periodos(db: Session = Depends(get_db)):
    try:
        periodos = db.execute(select(Periodo).order_by(Periodo.id)).scalars().all()
        return [{"id": p.id, "nombre": p.nombre} for p in periodos]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 


def normalizar_asignatura(nombre: str) -> str:
    return (
        unicodedata.normalize('NFD', nombre)
        .encode('ascii', 'ignore')
        .decode('utf-8')
        .lower()
        .replace(' ', '_')
        .replace('-', '_')  
        .rstrip('_')      
    )

@router.get("/estudiantes-por-grado/{grado_id}")
def get_estudiantes_por_grado(
    grado_id: int,
    asignatura: str,
    periodo: int,
    db: Session = Depends(get_db)
):
    try:
        # Normalizar la asignatura recibida del frontend
        asignatura_normalizada = normalizar_asignatura(asignatura)

        # Cargar estudiantes
        estudiantes = db.execute(
            select(Estudiante)
            .where(Estudiante.grado_id == grado_id)
            .order_by(Estudiante.apellidos, Estudiante.nombres)
        ).scalars().all()

        # Cargar TODAS las calificaciones de estos estudiantes en ese periodo
        estudiante_ids = [e.id for e in estudiantes]
        calificaciones = db.execute(
            select(Calificacion)
            .where(
                Calificacion.estudiante_id.in_(estudiante_ids),
                Calificacion.periodo == periodo
            )
        ).scalars().all()

        # Filtrar en Python por asignatura normalizada (seguro y compatible)
        calificaciones_filtradas = [
            cal for cal in calificaciones
            if normalizar_asignatura(cal.asignatura) == asignatura_normalizada
        ]

        # Mapear notas
        calificaciones_map = {}
        for cal in calificaciones_filtradas:
            if cal.estudiante_id not in calificaciones_map:
                calificaciones_map[cal.estudiante_id] = {}
            calificaciones_map[cal.estudiante_id][cal.columna] = str(cal.nota)

        # Construir respuesta
        resultado = []
        for est in estudiantes:
            cal_est = calificaciones_map.get(est.id, {})
            max_col = max(cal_est.keys()) if cal_est else 0
            num_notas = max(10, max_col)
            notas = [cal_est.get(i, "") for i in range(1, num_notas + 1)]

            resultado.append({
                "id": est.id,
                "nombres": est.nombres,
                "apellidos": est.apellidos,
                "notas": notas
            })

        return resultado

    except Exception as e:
        print(f"Error en /estudiantes-por-grado: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al cargar calificaciones")
     
    
@router.post("/guardar-calificaciones")
def guardar_calificaciones(
    data: dict,
    db: Session = Depends(get_db)
):
    try:
        grupo = data.get("grupo")
        asignatura = data.get("asignatura")
        periodo = data.get("periodo")
        estudiantes = data.get("estudiantes")

        if not grupo or not asignatura or not periodo or not estudiantes:
            raise HTTPException(status_code=400, detail="Faltan datos requeridos.")

        for est in estudiantes:
            estudiante_id = est.get("id")
            notas = est.get("notas", [])

            # Eliminar calificaciones existentes
            db.query(Calificacion).filter(
                Calificacion.estudiante_id == estudiante_id,
                Calificacion.asignatura == asignatura,
                Calificacion.periodo == periodo
            ).delete()

            # Crear nuevas calificaciones
            for idx, nota in enumerate(notas):
                if nota != "":
                    nueva_calificacion = Calificacion(
                        estudiante_id=estudiante_id,
                        asignatura=asignatura,
                        periodo=periodo,
                        nota=float(nota),
                        columna=idx + 1
                    )
                    db.add(nueva_calificacion)

        db.commit()
        return {"message": "Calificaciones guardadas correctamente."}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/duracion-clase")
def get_duracion_clase(db: Session = Depends(get_db)):
    try:
        duraciones = db.execute(select(DuracionClase).order_by(DuracionClase.valor)).scalars().all()
        return [{"id": str(d.id), "valor": d.valor, "etiqueta": d.etiqueta} for d in duraciones]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/guardar-asistencia")
def guardar_asistencia(request: dict, db: Session = Depends(get_db)):
    try:
        grupo_id = int(request["grupo"])
        periodo_id = int(request["periodo"])
        duracion = int(request["duracion"])

        db.execute(
            delete(Asistencia).where(
                Asistencia.grupo_id == grupo_id,
                Asistencia.asignatura == request["asignatura"],
                Asistencia.periodo_id == periodo_id
            )
        )

        for est in request["estudiantes"]:
            for dia_semana, estado in enumerate(est["asistencia"]):
                if estado in {"P", "A", "R", "PARCIAL", "PARCIAL1", "PARCIAL2"}:
                    asistencia_registro = Asistencia(
                        estudiante_id=int(est["id"]),
                        grupo_id=grupo_id,
                        asignatura=request["asignatura"],
                        periodo_id=periodo_id,
                        duracion=duracion,
                        dia_semana=dia_semana,
                        estado=estado
                    )
                    db.add(asistencia_registro)

        db.commit()
        return {"message": "Asistencia guardada correctamente."}
    except ValueError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Valores inválidos en la solicitud.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar: {str(e)}") 


@router.get("/asistencia-por-grupo/{grupo_id}")
def get_asistencia_por_grupo(
    grupo_id: int,
    asignatura: str,
    periodo: int,
    db: Session = Depends(get_db)
):
    try:
        asistencias = db.execute(
            select(Asistencia)
            .where(
                Asistencia.grupo_id == grupo_id,
                Asistencia.asignatura == asignatura,
                Asistencia.periodo_id == periodo
            )
        ).scalars().all()

        # Agrupar por estudiante_id
        asistencia_map = {}
        for asist in asistencias:
            if asist.estudiante_id not in asistencia_map:
                asistencia_map[asist.estudiante_id] = [""] * 7  # 7 días vacíos
            if 0 <= asist.dia_semana < 7:
                asistencia_map[asist.estudiante_id][asist.dia_semana] = asist.estado

        return {"asistencia": asistencia_map}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))   
    
@router.get("/estudiantes-por-grupo-asignatura/{grupo_id}")
def get_estudiantes_por_grupo_asignatura(
    grupo_id: int,
    asignatura: str,
    db: Session = Depends(get_db)
):
    try:
        estudiantes = db.execute(
            select(Estudiante)
            .where(Estudiante.grado_id == grupo_id)
            .order_by(Estudiante.apellidos, Estudiante.nombres)
        ).scalars().all()

        return [
            {
                "id": est.id,
                "nombres": est.nombres,
                "apellidos": est.apellidos,
            }
            for est in estudiantes
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.post("/enviar-tarea")
async def enviar_tarea(
    grupo: str = Form(...),
    asignatura: str = Form(...),
    fecha_inicio: str = Form(...),
    fecha_fin: str = Form(...),
    tema: str = Form(...),
    descripcion: str = Form(...),
    url: str = Form(""),
    estudiantes: str = Form(...),
    archivo: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        # Parsear lista de estudiantes
        lista_estudiantes = json.loads(estudiantes)
        if not isinstance(lista_estudiantes, list) or not all(isinstance(i, int) for i in lista_estudiantes):
            raise HTTPException(status_code=400, detail="Formato inválido para estudiantes")

        # Guardar archivo si existe
        archivo_path = None
        if archivo:
            uploads_dir = Path("uploads/tareas")
            uploads_dir.mkdir(parents=True, exist_ok=True)
            filename = f"{uuid.uuid4()}_{archivo.filename}"
            file_path = uploads_dir / filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(archivo.file, buffer)
            archivo_path = str(file_path)

        # Crear tarea
        nueva_tarea = Tarea(
            grupo_id=int(grupo),
            asignatura=asignatura,
            tema=tema,
            descripcion=descripcion,
            url=url,
            archivo=archivo_path,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin
        )
        db.add(nueva_tarea)
        db.flush()  # para obtener el id

        # Crear relaciones con estudiantes
        for est_id in lista_estudiantes:
            db.add(TareaEstudiante(tarea_id=nueva_tarea.id, estudiante_id=est_id))

        db.commit()
        db.refresh(nueva_tarea)

        return {"success": True, "message": "Tarea enviada correctamente."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar la tarea: {str(e)}")  
    
@router.get("/estudiante/{estudiante_id}")
def get_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    try:
        estudiante = db.execute(
            select(Estudiante).where(Estudiante.id == estudiante_id)
        ).scalar_one_or_none()
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")
        return {
            "id": estudiante.id,
            "nombres": estudiante.nombres,
            "apellidos": estudiante.apellidos,
            "numero_documento": estudiante.numero_documento,
            "tipo_documento": estudiante.tipo_documento,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))       




def generar_calificaciones_pdf_en_memoria(buffer, datos_estudiante, notas, asignatura, periodo):
    nombre = datos_estudiante["nombre_completo"]
    grado = datos_estudiante["grado"]
    documento = datos_estudiante.get("documento", "N/A")

    # Filtrar solo las notas con valor real, manteniendo el número de columna
    notas_con_indice = []
    for i, nota in enumerate(notas):
        if nota != "" and nota is not None:
            try:
                float(nota)  # validar que sea numérico
                notas_con_indice.append((i + 1, nota))
            except ValueError:
                continue  # ignorar valores no numéricos

    if notas_con_indice:
        filas_notas = ""
        notas_validas = []
        for num, nota_str in notas_con_indice:
            try:
                n = float(nota_str)
                notas_validas.append(n)
                if n >= 4.5:
                    estado = "Aprobado"
                    color = "#27AE60"
                elif n >= 4.0:
                    estado = "Aprobado"
                    color = "#2ECC71"
                elif n >= 3.0:
                    estado = "Aprobado"
                    color = "#F39C12"
                else:
                    estado = "Reprobado"
                    color = "#E74C3C"
                nota_mostrar = f"{n:.1f}"
            except:
                estado = "Pendiente"
                color = "#95a5a6"
                nota_mostrar = "—"

            filas_notas += f"""
            <tr>
                <td><strong>{num}</strong></td>
                <td>Nota {num}</td>
                <td style="color: {color}; font-weight: bold;">{nota_mostrar}</td>
                <td style="color: {color}; font-weight: bold;">{estado}</td>
            </tr>
            """
    else:
        filas_notas = """
        <tr>
            <td colspan="4" style="text-align: center; padding: 20px; color: #7f8c8d;">
                No hay calificaciones registradas para este estudiante.
            </td>
        </tr>
        """
        notas_validas = []

    # Estadísticas
    promedio = round(sum(notas_validas) / len(notas_validas), 2) if notas_validas else 0
    maxima = max(notas_validas) if notas_validas else 0
    minima = min(notas_validas) if notas_validas else 0
    aprobadas = sum(1 for n in notas_validas if n >= 3.0)
    reprobadas = len(notas_validas) - aprobadas

    color_promedio = "#27AE60" if promedio >= 4.5 else "#2ECC71" if promedio >= 4.0 else "#F39C12" if promedio >= 3.0 else "#E74C3C"

    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    hora_actual = datetime.now().strftime("%H:%M")

    html_content = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12pt;
                color: #000;
                margin: -25pt;                
                background: white;
            }}
            .header {{
                text-align: center;
                margin-bottom: 10pt;
            }}
            .titulo-principal {{
                font-size: 18pt;
                font-weight: bold;
                color: #2C3E50;
                margin-bottom: 2pt;
            }}
            .subtitulo {{
                font-size: 14pt;
                font-weight: bold;
                color: #3498DB;
                margin-bottom: 10pt;
            }}
            .linea-decorativa {{
                height: 2pt;
                background: #3498DB;
                margin: 5pt auto;
                width: 100%;
            }}
            .info-estudiante {{
                border: 1.5pt solid #2C3E50;
                margin-bottom: 20pt;
            }}
            .info-row {{
                display: flex;
            }}
            .info-label {{
                background: #ECF0F1;
                font-weight: bold;
                color: #2C3E50;
                padding: 8pt 10pt;
                width: 120pt;
                font-size: 11pt;
            }}
            .info-value {{
                padding: 8pt 10pt;
                color: #34495E;
                font-size: 11pt;
            }}
            .section-title {{
                font-size: 12pt;
                font-weight: bold;
                color: #2C3E50;
                margin: 20pt 0 10pt 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20pt;
            }}
            th {{
                background: #34495E;
                color: white;
                padding: 8pt;
                font-weight: bold;
                text-align: center;
            }}
            td {{
                padding: 8pt;
                text-align: center;
                border: 0.5pt solid #ddd;
                font-size: 10pt;
            }}
            .pie-pagina {{
                text-align: center;
                font-style: italic;
                color: #7f8c8d;
                font-size: 10pt;
                margin-top: 20pt;
                padding-top: 8pt;
                border-top: 0.5pt solid #ECF0F1;
            }}
            .footer-info {{
                display: flex;
                justify-content: space-between;
                font-size: 10pt;
                color: #7f8c8d;
                margin-top: 10pt;
                padding-top: 10pt;
                border-top: 0.5pt solid #ECF0F1;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="titulo-principal">COLEGIO STEM 360</div>
            <div class="subtitulo">REPORTE DE CALIFICACIONES</div>
            <div class="linea-decorativa"></div>
        </div>

        <div class="info-estudiante">
            <div class="info-row">
                <div class="info-label">ESTUDIANTE:</div>
                <div class="info-value">{nombre}</div>
            </div>
            <div class="info-row">
                <div class="info-label">DOCUMENTO:</div>
                <div class="info-value">{documento}</div>
            </div>
            <div class="info-row">
                <div class="info-label">GRADO:</div>
                <div class="info-value">{grado}</div>
            </div>
            <div class="info-row">
                <div class="info-label">ASIGNATURA:</div>
                <div class="info-value">{asignatura}</div>
            </div>
            <div class="info-row">
                <div class="info-label">PERIODO:</div>
                <div class="info-value">{periodo}</div>
            </div>
        </div>

        <div class="section-title">DETALLE DE CALIFICACIONES</div>
        <table>
            <thead>
                <tr>
                    <th>N°</th>
                    <th>COLUMNA</th>
                    <th>NOTA</th>
                    <th>ESTADO</th>
                </tr>
            </thead>
            <tbody>
                {filas_notas}
            </tbody>
        </table>

        <div style="height: 1pt; background: #ECF0F1; margin: 15pt 0;"></div>

        <div class="section-title">RESUMEN ESTADÍSTICO</div>
        <table>
            <thead>
                <tr>
                    <th>Promedio</th>
                    <th>Nota Máxima</th>
                    <th>Nota Mínima</th>
                    <th>Total Notas</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="color: {color_promedio}; font-weight: bold;">{promedio:.2f}</td>
                    <td>{maxima:.1f}</td>
                    <td>{minima:.1f}</td>
                    <td>{len(notas_validas)}</td>
                </tr>
            </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; border: 1pt solid #2C3E50; padding: 10pt; margin-bottom: 30pt; font-weight: bold; font-size: 11pt;">
            <div><strong>Aprobadas:</strong> {aprobadas}</div>
            <div><strong>Reprobadas:</strong> {reprobadas}</div>
        </div>

        <div class="pie-pagina">
            Documento generado el {fecha_actual} a las {hora_actual}
        </div>

        <div class="footer-info">
            <span>Colegio STEM 360</span>
            <span>Página 1 de 1</span>
        </div>
    </body>
    </html>
    """

    HTML(string=html_content).write_pdf(buffer)
    
@router.post("/pdf/calificaciones")
def generar_pdf_calificaciones(
    request: dict = Body(...),
    db: Session = Depends(get_db)
):
    try:
        estudiante_id = request.get("estudiante")
        grupo_id = request.get("grupo")
        asignatura = request.get("asignatura")
        periodo = request.get("periodo")

        if not all([estudiante_id, grupo_id, asignatura, periodo]):
            raise HTTPException(status_code=400, detail="Faltan parámetros")

        estudiante = db.get(Estudiante, estudiante_id)
        grado = db.get(Grado, grupo_id)
        if not estudiante or not grado:
            raise HTTPException(status_code=404, detail="Estudiante o grado no encontrado")

        # Buscar calificaciones usando el nombre exacto de la asignatura (sin normalizar)
        calificaciones = db.execute(
            select(Calificacion)
            .where(
                Calificacion.estudiante_id == estudiante_id,
                Calificacion.asignatura.ilike(asignatura),
                Calificacion.periodo == periodo
            )
        ).scalars().all()

        cal_map = {cal.columna: str(cal.nota) for cal in calificaciones}
        notas = [cal_map.get(i, "") for i in range(1, 11)]

        buffer = BytesIO()
       
        generar_calificaciones_pdf_en_memoria(
            buffer,
            {
                "nombre_completo": f"{estudiante.apellidos} {estudiante.nombres}",
                "grado": grado.nombre,
                "documento": estudiante.numero_documento or "N/A"
            },
            notas,
            asignatura,
            str(periodo)
        )
        buffer.seek(0)

        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Reporte_Calificaciones_{estudiante.apellidos}_{estudiante.nombres}.pdf"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar PDF: {str(e)}")

@router.get("/boletin-completo/{estudiante_id}/{periodo_id}", response_model=BoletinCompletoResponse)
def get_boletin_completo(
    estudiante_id: int,
    periodo_id: int,
    db: Session = Depends(get_db)
):
    try:
        # Obtener estudiante
        estudiante = db.get(Estudiante, estudiante_id)
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")

        # Obtener grado
        grado = db.get(Grado, estudiante.grado_id)
        if not grado:
            raise HTTPException(status_code=404, detail="Grado no encontrado")

        # Obtener periodo
        periodo = db.get(Periodo, periodo_id)
        if not periodo:
            raise HTTPException(status_code=404, detail="Periodo no encontrado")

        # Obtener todas las asignaturas, excluyendo Descanso y Almuerzo
        asignaturas = db.execute(
            select(Asignatura).where(
                Asignatura.area != "Descanso",
                Asignatura.area != "Almuerzo"
            )
        ).scalars().all()

        asignaturas_boletin = []
        for asig in asignaturas:
            # Normalizar el nombre de la asignatura para la búsqueda
            nombre_asig_normalizado = normalizar_asignatura(asig.name)

            # Obtener calificaciones del estudiante en este periodo (sin filtrar por asignatura aún)
            calificaciones = db.execute(
                select(Calificacion)
                .where(
                    Calificacion.estudiante_id == estudiante_id,
                    Calificacion.periodo == periodo_id
                )
            ).scalars().all()

            # Filtrar calificaciones en Python usando la normalización
            calificaciones_filtradas = [
                c for c in calificaciones
                if normalizar_asignatura(c.asignatura) == nombre_asig_normalizado
            ]

            # Calcular promedio
            notas_validas = [c.nota for c in calificaciones_filtradas if c.nota is not None]
            nota_promedio = sum(notas_validas) / len(notas_validas) if notas_validas else None

            # Determinar estado
            estado = "Pendiente"
            if nota_promedio is not None:
                if nota_promedio >= 3.0:
                    estado = "Aprobado"
                else:
                    estado = "Reprobado"

            # Contar fallas (ausencias) en asistencia para esta asignatura
            fallas = 0
            asistencias = db.execute(
                select(Asistencia)
                .where(
                    Asistencia.estudiante_id == estudiante_id,
                    Asistencia.periodo_id == periodo_id
                )
            ).scalars().all()

            # Filtrar asistencias en Python usando la normalización
            asistencias_filtradas = [
                a for a in asistencias
                if normalizar_asignatura(a.asignatura) == nombre_asig_normalizado
            ]

            for asist in asistencias_filtradas:
                if asist.estado == "A":  # A = Ausente
                    fallas += 1

            asignaturas_boletin.append({
                "nombre_asignatura": asig.name, 
                "area": asig.area,               
                "hours_per_week": asig.hours_per_week,
                "nota_promedio": nota_promedio,
                "estado": estado,
                "fallas": fallas
            })

        return {
            "estudiante": {
                "nombre": f"{estudiante.apellidos} {estudiante.nombres}",
                "documento": estudiante.numero_documento or "N/A",
                "grado": grado.nombre,
                "periodo": periodo.nombre
            },
            "asignaturas": asignaturas_boletin
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar boletín: {str(e)}")

    
@router.get("/estudiantes-por-grado-simple/{grado_id}")
def get_estudiantes_por_grado_simple(grado_id: int, db: Session = Depends(get_db)):
    try:
        estudiantes = db.execute(
            select(Estudiante)
            .where(Estudiante.grado_id == grado_id)
            .order_by(Estudiante.apellidos, Estudiante.nombres)
        ).scalars().all()

        return [
            {
                "id": est.id,
                "nombres": est.nombres,
                "apellidos": est.apellidos,
            }
            for est in estudiantes
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))   

# --- GENERAR BOLETÍN PDF --- #     
    
def generar_boletin_pdf_en_memoria(buffer, datos_boletin):
    
    estudiante = datos_boletin["estudiante"]
    asignaturas = datos_boletin["asignaturas"]
    
    # --- Cálculo del Promedio General ---
    notas_validas = [asig['nota_promedio'] for asig in asignaturas if asig['nota_promedio'] is not None]
    promedio_general = sum(notas_validas) / len(notas_validas) if notas_validas else 0.0
    promedio_str = f"{promedio_general:.2f}" if notas_validas else "—"

    # --- GENERAR CÓDIGO QR ---
    qr_data = f"""
    COLEGIO STEM 360
    Estudiante: {estudiante['nombre']}
    Documento: {estudiante['documento']}
    Grado: {estudiante['grado']}
    Periodo: {estudiante['periodo']}
    Promedio General: {promedio_str}
    Fecha: {datetime.now().strftime('%d/%m/%Y')}
    """.strip()

    # Crea y configura el código QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_L,
        box_size=8,  # Tamaño más grande para el PDF
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    # Convierte la imagen del QR a base64
    qr_buffer = BytesIO()
    img.save(qr_buffer, "PNG")
    qr_base64 = base64.b64encode(qr_buffer.getvalue()).decode("utf-8")

    # --- Agrupar asignaturas por área ---
    grupos = {}
    for asig in asignaturas:
        area = asig["area"]
        if area not in grupos:
            grupos[area] = []
        grupos[area].append(asig)
    
    # Construir las filas de la tabla
    filas_html = ""
    for area, lista_asignaturas in grupos.items():
        filas_html += f"""
        <tr>
            <td colspan="5" style="background-color: #d0e7ff; font-weight: bold; text-align: left; padding: 8pt;">
                {area.upper()}
            </td>
        </tr>
        """
        for asig in lista_asignaturas:
            nota_str = f"{asig['nota_promedio']:.2f}" if asig['nota_promedio'] is not None else "—"
            estado_color = "#27AE60" if asig['estado'] == "Aprobado" else "#E74C3C" if asig['estado'] == "Reprobado" else "#95a5a6"
            filas_html += f"""
            <tr>
                <td style="text-align: left; padding: 8pt;">{asig['nombre_asignatura']}</td>
                <td style="text-align: center; padding: 8pt;">{asig['hours_per_week']}</td>
                <td style="text-align: center; padding: 8pt; color: {estado_color};">{nota_str}</td>
                <td style="text-align: center; padding: 8pt; color: {estado_color};">
                    {asig['estado']}
                </td>
                <td style="text-align: center; padding: 8pt;">{asig['fallas']}</td>
            </tr>
            """

    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    hora_actual = datetime.now().strftime("%H:%M")

    html_content = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, Helvetica, sans-serif;
                font-size: 10pt;
                color: #000;
                margin: -25pt;
                background: white;
            }}
            .header {{
                text-align: center;
                margin-bottom: 15pt;
            }}
            .titulo-principal {{
                font-size: 18pt;
                font-weight: bold;
                color: #2C3E50;
                margin-bottom: 2pt;
            }}
            .subtitulo {{
                font-size: 14pt;
                font-weight: bold;
                color: #3498DB;
                margin-bottom: 10pt;
            }}
            .linea-decorativa {{
                height: 2pt;
                background: #3498DB;
                margin: 5pt auto;
                width: 100%;
            }}
            .info-estudiante {{
                border: 1.0pt solid #2C3E50;
                border-radius: 5pt;
                margin-bottom: 20pt;                
            }}
            .info-row {{
                display: flex;
            }}
            .info-label {{
                background: #ECF0F1;
                border-radius: 5pt 0 0 5pt;
                font-weight: bold;
                color: #2C3E50;
                padding: 8pt 10pt;
                width: 120pt;
                font-size: 10pt;
            }}
            .info-value {{
                padding: 8pt 10pt;
                color: #34495E;
                font-size: 10pt;
            }}
            .section-title {{
                font-size: 12pt;
                font-weight: bold;
                color: #2C3E50;
                margin: 20pt 0 10pt 0;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20pt;
                margin-right: 20pt;
            }}
            th {{
                background: #34495E;
                color: white;
                padding: 8pt;
                font-weight: bold;
                text-align: center;
            }}
            td {{
                padding: 8pt;
                border: 0.5pt solid #ddd;
                font-size: 9pt;
            }}  
            
            .section-title-promedio{{
                font-size: 10pt;
                font-weight: normal;
                color: #7f8c8d;
                margin: 10pt 0 10pt 0;
                text-align: center;
            }}         
              
            .promedio-general-container {{
                background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%);
                border-radius: 5px;
                padding: 16pt;
                margin: 20pt 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
            }}
            .promedio-texto {{
                display: flex;
                flex-direction: column;
                gap: 4pt;
            }}
            .promedio-titulo {{
                font-size: 10pt;
                color: #7c3aed;
                font-weight: 600;
            }}
            .promedio-numero {{
                font-size: 24pt;
                font-weight: 700;
                color: #7c3aed;
                line-height: 1;
            }}
            .promedio-periodo {{
                font-size: 8pt;
                color: #9333ea;
                font-weight: 500;
            }}
            .promedio-title {{
                text-align: center;
                color: #7f8c8d;
            }}
            
            /* Estilos para el contenedor del QR */
            .qr-container {{
                text-align: center;
                margin: 30pt 0;
            }}
            .qr-container img {{
                width: 150pt;
                height: 150pt;
            }}
            .qr-container p {{
                margin-top: 8pt;
                font-size: 10pt;
                color: #7f8c8d;
                font-weight: 600;
            }}
            
            .pie-pagina {{
                text-align: center;
                font-style: italic;
                color: #7f8c8d;
                font-size: 9pt;
                margin-top: 20pt;
                padding-top: 8pt;
                border-top: 0.5pt solid #ECF0F1;
            }}
            .footer-info {{
                display: flex;
                justify-content: space-between;
                font-size: 9pt;
                color: #7f8c8d;
                margin-top: 10pt;
                padding-top: 10pt;
                border-top: 0.5pt solid #ECF0F1;
            }}
            .version-info {{
                text-align: center;
                font-size: 9pt;
                color: #7f8c8d;
                margin-top: 10pt;
                padding-top: 10pt;
                border-top: 0.5pt solid #ECF0F1;
            }}
            .version-info-software {{
                text-align: center;
                font-size: 9pt;
                color: #7f8c8d;
                 margin-top: 5pt;
            }}    
        </style>
    </head>
    <body>
        <div class="header">
            <div class="titulo-principal">COLEGIO STEM 360</div>
            <div class="subtitulo">BOLETÍN DE CALIFICACIONES</div>
            <div class="linea-decorativa"></div>
        </div>

        <div class="info-estudiante">
            <div class="info-row">
                <div class="info-label">ESTUDIANTE:</div>
                <div class="info-value">{estudiante['nombre']}</div>
            </div>
            <div class="info-row">
                <div class="info-label">DOCUMENTO:</div>
                <div class="info-value">{estudiante['documento']}</div>
            </div>
            <div class="info-row">
                <div class="info-label">GRADO:</div>
                <div class="info-value">{estudiante['grado']}</div>
            </div>
            <div class="info-row">
                <div class="info-label">PERIODO:</div>
                <div class="info-value">{estudiante['periodo']}</div>
            </div>
        </div>       

        <div class="section-title">INFORME ACADÉMICO</div>
        <table>
            <thead>
                <tr>
                    <th>ASIGNATURA</th>
                    <th>I.H.</th>
                    <th>NOTA</th>
                    <th>ESTADO</th>
                    <th>FALLAS</th>
                </tr>
            </thead>
            <tbody>
                {filas_html}
            </tbody>
        </table>
        <div class="section-title-promedio">
            Escala de Calificación: 1.0 - 2.9 Reprobado | 3.0 - 4.0 Aprobado | 4.5 - 5.0 Excelente
        </div>
        <div class="promedio-general-container">
            <div class="promedio-texto">
                <div class="promedio-titulo">Promedio General</div>
                <div class="promedio-numero">{promedio_str}</div>
                <div class="promedio-periodo">Periodo {estudiante['periodo'].replace('Periodo ', '')}</div>
            </div>           
        </div>
        
        <!-- Código QR grande y centrado -->
        <div class="qr-container">
            <img src="data:image/png;base64,{qr_base64}" alt="Código QR de verificación">
            <p>Código de verificación - Gestión 360</p>
        </div>

        <!-- Línea de generación automática y versión -->
        <div class="version-info">
            Documento generado automáticamente el: {fecha_actual} a las {hora_actual}            
        </div>
        <div class="version-info-software">
            Sistema de Gestión Administrativa y Procesos Académicos (SGAPA) - Versión 1.0
        </div>
        <div class="footer-info">
            <span>Colegio STEM 360</span>
            <span>Página 2 de 2</span>
        </div>
    </body>
    </html>
    """

    HTML(string=html_content).write_pdf(buffer)    
    

@router.get("/pdf/boletin/{estudiante_id}/{periodo_id}")
def generar_pdf_boletin(
    estudiante_id: int,
    periodo_id: int,
    db: Session = Depends(get_db)
):
    try:
        # Reutilizar la lógica existente para obtener los datos
        datos_boletin = get_boletin_completo(estudiante_id, periodo_id, db)
        
        buffer = BytesIO()
        generar_boletin_pdf_en_memoria(buffer, datos_boletin)
        buffer.seek(0)

        nombre_estudiante = datos_boletin["estudiante"]["nombre"].replace(" ", "_")
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Boletin_{nombre_estudiante}_P{periodo_id}.pdf"}
        )

    except Exception as e:
        print(f"Error generando PDF del boletín: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al generar el PDF del boletín: {str(e)}")    
    
    
# --- GENERAR CERTIFICADO ESCOLAR PDF --- #   
def generar_certificado_escolar_pdf(buffer, estudiante, grado_nombre):
    
    nombre_completo = f"{estudiante.nombres} {estudiante.apellidos}"
    documento = estudiante.numero_documento or "N/A"
    tipo_documento = estudiante.tipo_documento or "TI y/o C.C"
    
    # --- Fecha ---
    hoy = date.today()
    dia = hoy.day
    mes = hoy.strftime("%B")
    año = hoy.year

    meses = {
        "January": "enero", "February": "febrero", "March": "marzo", "April": "abril",
        "May": "mayo", "June": "junio", "July": "julio", "August": "agosto",
        "September": "septiembre", "October": "octubre", "November": "noviembre", "December": "diciembre"
    }
    mes_es = meses.get(mes, mes).lower()
    fecha_emision = hoy.strftime('%d/%m/%Y')

  
    qr_data = f"""COLEGIO STEM 360
        Estudiante: {nombre_completo}
        Documento: {documento}
        Grado: {grado_nombre}
        Fecha de emisión: {fecha_emision}
        Tipo: Certificado de estudio""".strip()

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_L,
        box_size=8,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    qr_buffer = BytesIO()
    img.save(qr_buffer, "PNG")
    qr_base64 = base64.b64encode(qr_buffer.getvalue()).decode("utf-8")

   
    ahora = datetime.now()
    fecha_hora_generacion = ahora.strftime("%d/%m/%Y a las %H:%M")

    html_content = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Times New Roman', Times, serif;
                font-size: 13pt;
                color: #000;
                text-align: center;
                margin: 0.1cm;
            }}
            .titulo-principal {{
                font-size: 16pt;
                font-weight: bold;
                color: #2C3E50;
            }}
            .subtitulo {{
                font-size: 12pt;
                font-weight: bold;
                color: #3498DB;
                margin-top: 15pt;
            }}
            .linea-decorativa {{
                height: 2pt;
                background: #3498DB;
                width: 100%;
                margin: 15pt auto 25pt auto;
            }}
            .certifica-texto {{
                font-size: 12pt;
                line-height: 1.7;
                text-align: justify;
                margin: 0 auto 10pt auto;
                max-width: 1200pt;   
            }}
            .certifican {{
                font-size: 12pt;
                font-weight: bold;                
                display: block;
                text-align: center;
                margin: 20pt 0;
            }}
            .firma-container {{
                display: flex;
                justify-content: center;
                gap: 40pt;   
                margin-top: 80pt;
            }}
            .firma-item {{
                text-align: center;
                width: 280pt;
            }}
            .firma-linea {{
                border-top: 1pt solid #000;
                margin-bottom: 5pt;
            }}
            .firma-titulo {{
                font-weight: bold;
                margin: 0;
                font-size: 10pt;
            }}
            /* Estilos para el QR */
            .qr-container {{
                text-align: center;
                margin: 40pt 0 20pt 0;
            }}
            .qr-container img {{
                width: 140pt;
                height: 140pt;
            }}
            .qr-container p {{
                margin-top: 8pt;
                font-size: 10pt;
                color: #7f8c8d;
                font-weight: 600;
            }}
             .version-info {{
                text-align: center;
                font-size: 9pt;
                color: #7f8c8d;
                margin-top: 10pt;
                padding-top: 10pt;
                border-top: 0.5pt solid #ECF0F1;
            }}
            .version-info-software {{
                text-align: center;
                font-size: 9pt;
                color: #7f8c8d;
                 margin-top: 5pt;
            }}    
            /* Firma digital a la izquierda */
            .firma-digital {{
                text-align: left;
                font-size: 10pt;
                color: #7f8c8d;
                margin: 10pt 0 20pt 0;
                font-style: italic;
            }}
             .footer-info {{
                display: flex;
                justify-content: space-between;
                font-size: 9pt;
                color: #7f8c8d;
                margin-top: 10pt;
                padding-top: 10pt;
                border-top: 0.5pt solid #ECF0F1;
            }}
        </style>
    </head>
    <body>
        <div class="titulo-principal">COLEGIO STEM 360</div>
        <div class="subtitulo">CERTIFICADO DE ESTUDIO</div>
        <div class="linea-decorativa"></div>

        <p class="certifica-texto" style="text-align:center; font-weight:bold;">
            LA SUSCRITA RECTORA Y LA SECRETARIA ACADÉMICA
        </p>

        <span class="certifican">CERTIFICAN</span>

        <p class="certifica-texto">
            Que el(la) estudiante <strong>{nombre_completo}</strong>, identificado(a)
            con {tipo_documento} No <strong>{documento}</strong>, se encuentra
            matriculado(a) y asistiendo a clases en esta Institución Educativa en el grado 
            <strong>{grado_nombre}</strong>, jornada única en el año lectivo 
            <strong>2025</strong> calendario A, con un horario de 
            <strong>7:00 am a 2:00 pm</strong> de lunes a viernes, para un total de 
            <strong>40 horas semanales</strong>.
        </p>

        <p class="certifica-texto">
            Se expide a solicitud del interesado(a), a los <strong>{dia}</strong> días del mes de 
            <strong>{mes_es}</strong> del <strong>{año}</strong>.
        </p>

        <div class="firma-container">
            <div class="firma-item">
                <div class="firma-linea"></div>
                <p class="firma-titulo">RECTORA</p>
            </div>
            <div class="firma-item">
                <div class="firma-linea"></div>
                <p class="firma-titulo">SECRETARIA ACADÉMICA</p>
            </div> 
        </div>

        <!-- Firma digital a la izquierda -->
        <div class="firma-digital">
            Firma digital Autorizada
        </div>

        <!-- Código QR de verificación -->
        <div class="qr-container">
            <img src="data:image/png;base64,{qr_base64}" alt="Código QR de verificación">
            <p>Código de verificación - Gestión 360</p>
        </div>

          <!-- Línea de generación automática y versión -->
        <div class="version-info">
            Documento generado automáticamente el: {fecha_hora_generacion}               
        </div>
        <div class="version-info-software">
            Sistema de Gestión Administrativa y Procesos Académicos (SGAPA) - Versión 1.0
        </div>
        <div class="footer-info">
            <span>Colegio STEM 360</span>
            <span>Página 1 de 1</span>
        </div>

       
    </body>
    </html>
    """

    HTML(string=html_content).write_pdf(buffer)

@router.get("/pdf/certificado-escolar/{estudiante_id}")
def generar_pdf_certificado_escolar(
    estudiante_id: int,
    db: Session = Depends(get_db)
):
    try:
        # Obtener estudiante
        estudiante = db.get(Estudiante, estudiante_id)
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")

        # Obtener grado
        grado = db.get(Grado, estudiante.grado_id)
        if not grado:
            raise HTTPException(status_code=404, detail="Grado no encontrado")

        buffer = BytesIO()
        generar_certificado_escolar_pdf(buffer, estudiante, grado.nombre)
        buffer.seek(0)

        nombre_estudiante = f"{estudiante.apellidos}_{estudiante.nombres}".replace(" ", "_")
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Certificado_Escolar_{nombre_estudiante}.pdf"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar el certificado: {str(e)}")

# === NUEVOS ENDPOINTS PARA ESTÁNDARES Y DBA ===

@router.get("/estandares-por-asignatura")
def get_estandares_por_asignatura(
    asignatura: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene los estándares asociados a una asignatura (ej. 'matematicas').
    El parámetro 'asignatura' debe ser el nombre normalizado (ej. 'matematicas').
    """
    try:
        # Buscar la asignatura por nombre (insensible a mayúsculas y acentos)
        asignatura_obj = db.execute(
            select(Asignatura).where(
                Asignatura.name.op('~*')(asignatura.replace("_", " "))
            )
        ).scalar_one_or_none()

        if not asignatura_obj:
            raise HTTPException(status_code=404, detail="Asignatura no encontrada")

        # Obtener estándares
        estandares = db.execute(
            select(Estandar).where(Estandar.subject_id == asignatura_obj.subject_id)
        ).scalars().all()

        return [
            {"id": est.id, "nombre": est.nombre}
            for est in estandares
        ]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cargar estándares: {str(e)}")


@router.get("/dba-por-filtros")
def get_dba_por_filtros(
    asignatura: str,
    grado_id: int,
    estandar_id: int,
    db: Session = Depends(get_db)
):
    
    try:
        # 1. Validar asignatura
        asignatura_obj = db.execute(
            select(Asignatura).where(
                Asignatura.name.op('~*')(asignatura.replace("_", " "))
            )
        ).scalar_one_or_none()
        if not asignatura_obj:
            raise HTTPException(status_code=404, detail="Asignatura no encontrada")

        # 2. Validar grado
        grado_obj = db.get(Grado, grado_id)
        if not grado_obj:
            raise HTTPException(status_code=404, detail="Grado no encontrado")

        # 3. Validar estándar y que pertenezca a la asignatura
        estandar_obj = db.get(Estandar, estandar_id)
        if not estandar_obj:
            raise HTTPException(status_code=404, detail="Estándar no encontrado")
        
        # CORRECCIÓN: Comparar subject_id del estándar con subject_id de la asignatura
        # Extraer valores explícitamente
        estandar_subject_id = estandar_obj.subject_id
        asignatura_subject_id = asignatura_obj.subject_id
        
        if estandar_subject_id != asignatura_subject_id:
            raise HTTPException(status_code=400, detail="El estándar no pertenece a la asignatura indicada")

        # 4. Buscar la combinación asignatura-grado
        asignatura_grado = db.execute(
            select(AsignaturaGrado).where(
                AsignaturaGrado.subject_id == asignatura_obj.subject_id,
                AsignaturaGrado.grado_id == grado_id
            )
        ).scalar_one_or_none()

        if not asignatura_grado:
            return []  # No hay DBA si no existe la combinación

        # 5. Obtener los DBA
        dbas = db.execute(
            select(Dba).where(
                Dba.asignatura_grado_id == asignatura_grado.id,
                Dba.estandar_id == estandar_id
            )
        ).scalars().all()

        return [
            {"id": dba.id, "descripcion": dba.descripcion, "codigo": dba.codigo or ""}
            for dba in dbas
        ]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cargar DBA: {str(e)}")