from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.database import get_db
from backend.models import Grado, Asignatura, Periodo, Estudiante, Calificacion, DuracionClase

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


@router.get("/estudiantes-por-grado/{grado_id}")
def get_estudiantes_por_grado(
    grado_id: int,
    asignatura: str,
    periodo: int,
    db: Session = Depends(get_db)
):
    try:
        # Cargar estudiantes del grado
        estudiantes = db.execute(
            select(Estudiante)
            .where(Estudiante.grado_id == grado_id)
            .order_by(Estudiante.apellidos, Estudiante.nombres)
        ).scalars().all()

        # Cargar todas las calificaciones para estos estudiantes, asignatura y periodo
        estudiante_ids = [e.id for e in estudiantes]
        calificaciones = db.execute(
            select(Calificacion)
            .where(
                Calificacion.estudiante_id.in_(estudiante_ids),
                Calificacion.asignatura == asignatura,
                Calificacion.periodo == periodo
            )
        ).scalars().all()

        # Crear un mapa: {estudiante_id: {columna: nota}}
        calificaciones_map = {}
        for cal in calificaciones:
            if cal.estudiante_id not in calificaciones_map:
                calificaciones_map[cal.estudiante_id] = {}
            calificaciones_map[cal.estudiante_id][cal.columna] = str(cal.nota)

        # Formatear la respuesta
        resultado = []
        for est in estudiantes:
            # Obtener las calificaciones del estudiante
            calificaciones_est = calificaciones_map.get(est.id, {})
            
            # Determinar el número de columnas (al menos 10)
            numero_notas = 10
            if calificaciones_est:
                max_columna = max(calificaciones_est.keys())
                numero_notas = max(10, max_columna)

            notas = []
            for i in range(1, numero_notas + 1):
                notas.append(calificaciones_est.get(i, ""))

            resultado.append({
                "id": est.id,
                "nombres": est.nombres,
                "apellidos": est.apellidos,
                "notas": notas
            })

        return resultado

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))      
    
     
    
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