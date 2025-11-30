from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from jose import jwt
from backend.database import get_db
from backend.models import User
import uuid

SECRET_KEY = "tu_clave_secreta_aqui_cambiar_en_produccion"
ALGORITHM = "HS256"

security = HTTPBearer()

def verificar_token_jwt(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str = payload.get("sub")
        rol = payload.get("rol")

        if not user_id_str or not rol:
            raise Exception()

        # ✅ Convertir string a UUID explícitamente
        user_id_uuid = uuid.UUID(user_id_str)

        # ✅ Comparar UUID con UUID
        user = db.query(User).filter(User.id == user_id_uuid).first()
        if not user:
            raise Exception()

        return {"user_id": str(user_id_uuid), "rol": rol}

    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")