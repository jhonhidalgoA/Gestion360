from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import SessionLocal, Base, engine
from backend.models import User, Role
from passlib.context import CryptContext

app = FastAPI(title="Gestión 360 API")

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

# Contexto de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

# Schema para login
class LoginRequest(BaseModel):
    username: str
    password: str

# Ruta raíz
@app.get("/")
def root():
    return {"message": "API funcionando correctamente 🚀"}

# Ruta login simplificada
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Usuario o contraseña incorrecta")
    # Retornar JSON exactamente como quieres
    return {
        "message": "Login exitoso ✅",
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role.name if user.role else None
    }
