from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import SessionLocal, Base, engine
from backend.models import User, Role
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import jwt

app = FastAPI(title="Gestión 360 API")

# ⬇️ AGREGAR CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

# Contexto de contraseñas y JWT
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "tu_clave_secreta_aqui_cambiar_en_produccion"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Dependencia para DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Verificar contraseña
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# ⬇️ CREAR TOKEN JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Schema para login
class LoginRequest(BaseModel):
    username: str
    password: str

# Ruta raíz
@app.get("/")
def root():
    return {"message": "API funcionando correctamente 🚀"}

# Ruta login completa
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    # ⬇️ OBTENER ROL EN MINÚSCULAS
    role_name = "sin_rol"
    if user.role:
        role_name = str(user.role.name).lower()
    
    # ⬇️ CREAR TOKEN
    token_data = {"sub": user.username, "role": role_name}
    access_token = create_access_token(token_data)
    
    # ⬇️ MAPEAR REDIRECT SEGÚN ROL
    redirect_map = {
        "administrador": "/administrador",
        "docente": "/docente",
        "estudiante": "/estudiante",
        "padres": "/padres",
        "padre": "/padres",
    }
    redirect = redirect_map.get(role_name, "/")
    
    # ⬇️ ACTUALIZAR ÚLTIMO LOGIN (OPCIONAL)
    user.last_login = datetime.utcnow()
    user.last_active = datetime.utcnow()
    db.commit()
    
    # ⬇️ RETORNAR TODO LO QUE NECESITA EL FRONTEND
    return {
        "username": user.username,
        "full_name": user.full_name,
        "rol": role_name,
        "redirect": redirect,
        "access_token": access_token
    }