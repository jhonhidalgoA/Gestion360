from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.database import get_db

router = APIRouter(prefix="/api", tags=["docente"])

@router.get("/grados")
def get_grados(db: Session = Depends(get_db)):
    try:
        grados = db.execute(text("SELECT id, nombre FROM grados ORDER BY id")).fetchall()
        return [
            {"id": g[0], "nombre": g[1]}
            for g in grados
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/asignaturas")
def get_asignaturas(db: Session = Depends(get_db)):
    try:
        
        result = db.execute(text("SELECT subject_id, name FROM asignaturas ORDER BY name")).fetchall()
        return [
            {"id": row[0], "nombre": row[1]}
            for row in result
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))