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
from backend.models import Grado, Asignatura, Periodo, Estudiante, Calificacion, DuracionClase, Asistencia, Tarea, TareaEstudiante
from weasyprint import HTML
from datetime import datetime
from fastapi.responses import StreamingResponse
from fastapi import Body, HTTPException
from io import BytesIO


router = APIRouter(prefix="/api", tags=["docente"])

@router.get("/grados")
def get_grados(db: Session = Depends(get_db)):
    try:
        grados = db.execute(select(Grado).order_by(Grado.id)).scalars().all()
        return [{"id": g.id, "nombre": g.nombre} for g in grados]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/asignaturas")
def get_asignaturas(db: Session = Depends(get_db)):
    try:
        asignaturas = db.execute(select(Asignatura).order_by(Asignatura.name)).scalars().all()
        return [{"id": a.subject_id, "nombre": a.name} for a in asignaturas]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/periodos")
def get_periodos(db: Session = Depends(get_db)):
    try:
        periodos = db.execute(select(Periodo).order_by(Periodo.id)).scalars().all()
        return [{"id": p.id, "nombre": p.nombre} for p in periodos]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 


def normalizar_asignatura(nombre: str) -> str:
    """Convierte 'Biología' → 'biologia', 'Cátedra de Paz' → 'catedra_de_paz'"""
    return (
        unicodedata.normalize('NFD', nombre)
        .encode('ascii', 'ignore')
        .decode('utf-8')
        .lower()
        .replace(' ', '_')
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


# backend/pdf_calificaciones.py
from weasyprint import HTML
from datetime import datetime

def generar_calificaciones_pdf_en_memoria(buffer, datos_estudiante, notas, asignatura, periodo):
    nombre = datos_estudiante["nombre_completo"]
    grado = datos_estudiante["grado"]
    documento = datos_estudiante.get("documento", "N/A")

    # Procesar notas
    filas_notas = ""
    notas_validas = []
    for i, nota in enumerate(notas):
        num = i + 1
        if nota == "" or nota is None:
            estado = "Pendiente"
            nota_mostrar = "—"
            color = "#95a5a6"
        else:
            try:
                n = float(nota)
                notas_validas.append(n)
                if n >= 4.5:
                    estado = "✓ Aprobado"
                    color = "#27AE60"
                elif n >= 4.0:
                    estado = "✓ Aprobado"
                    color = "#2ECC71"
                elif n >= 3.0:
                    estado = "✓ Aprobado"
                    color = "#F39C12"
                else:
                    estado = "✗ Reprobado"
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
                margin: 0;
                padding: 20pt;
                background: white;
            }}
            .header {{
                text-align: center;
                margin-bottom: 20pt;
            }}
            .titulo-principal {{
                font-size: 18pt;
                font-weight: bold;
                color: #2C3E50;
                margin-bottom: 6pt;
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

        calificaciones = db.execute(
            select(Calificacion)
            .where(
                Calificacion.estudiante_id == estudiante_id,
                Calificacion.asignatura == asignatura,
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
    