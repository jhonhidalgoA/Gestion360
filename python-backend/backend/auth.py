# backend/auth.py

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from backend.database import get_db
from backend.models import User
import uuid

# Esquema para leer el token del encabezado
security = HTTPBearer()

def verificar_token_jwt(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """
    Valida el JWT y devuelve el UUID del usuario (user.id) y su rol.
    """
    try:
        # Decodificar el token
        payload = jwt.decode(credentials.credentials, "tu_clave_secreta_aqui_cambiar_en_produccion", algorithms=["HS256"])
        
        # Obtener los campos
        username = payload.get("sub")
        rol = payload.get("role")
        
        # Validar que sean strings
        if not isinstance(username, str) or not isinstance(rol, str):
            raise JWTError()
            
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Buscar al usuario por username (que es el número de documento)
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Devolver el user.id como string (es UUID) y el rol
    return {
        "user_id": str(user.id),
        "rol": rol
    }