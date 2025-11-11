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
from backend.schemas import StudentRegister
from backend.models import Estudiante, User, Role
from fastapi import status

app = FastAPI(title="Gestión 360 API")

# Agregar Cors
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

# Crear JWT
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
    
    # OBTENER ROL EN MINÚSCULAS
    role_name = "sin_rol"
    if user.role:
        role_name = str(user.role.name).lower()
    
    #  Crear Token
    token_data = {"sub": user.username, "role": role_name}
    access_token = create_access_token(token_data)
    
    #  Mapear según Rol
    redirect_map = {
        "administrador": "/administrador",
        "docente": "/docente",
        "estudiante": "/estudiante",
        "padres": "/padres",
        "padre": "/padres",
    }
    redirect = redirect_map.get(role_name, "/")
    
    #  ACTUALIZAR ÚLTIMO LOGIN (OPCIONAL)
    user.last_login = datetime.utcnow()
    user.last_active = datetime.utcnow()
    db.commit()
    
    # RETORNAR TODO LO QUE NECESITA EL FRONTEND
    return {
        "username": user.username,
        "full_name": user.full_name,
        "rol": role_name,
        "redirect": redirect,
        "access_token": access_token
    }

@app.post("/register-student", status_code=status.HTTP_201_CREATED)
def register_student(data: StudentRegister, db: Session = Depends(get_db)):
    # 1️⃣ Verificar si ya existe usuario con ese username
    existing_user = db.query(User).filter(User.username == data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")

    # 2️⃣ Crear usuario
    hashed_password = pwd_context.hash(data.password or "123456")
    role = db.query(Role).filter(Role.name.ilike("estudiante")).first()
    if not role:
        raise HTTPException(status_code=400, detail="No se encontró el rol 'estudiante'")

    new_user = User(
    full_name=f"{data.nombres} {data.apellidos}",
    username=data.numero_documento,
    password_hash=hashed_password,
    document_number=data.numero_documento, 
    role_id=2,  # Rol de estudiante
    must_change_password=True
)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3️⃣ Crear registro de estudiante
    new_student = Estudiante(        
        fecha_registro=data.fecha_registro,
        nombres=data.nombres,
        apellidos=data.apellidos,
        fecha_nacimiento=data.fecha_nacimiento,
        edad=data.edad,
        genero=data.genero,
        lugar_nacimiento=data.lugar_nacimiento,
        tipo_documento=data.tipo_documento,
        numero_documento=data.numero_documento,
        telefono=data.telefono,
        correo=data.correo,
        grado_id=data.grado_id,
        grupo=data.grupo,
        jornada=data.jornada,
        tipo_sangre=data.tipo_sangre,
        eps=data.eps,
        etnia=data.etnia,
        referencia=data.referencia,
        direccion=data.direccion,
        barrio=data.barrio,
        localidad=data.localidad,
        zona=data.zona,
        user_id=new_user.id
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "message": "Estudiante registrado exitosamente",
        "username": new_user.username,
        "id_estudiante": new_student.id
    }    
    