from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import Optional
import jwt
import uuid

# Importaciones locales
from backend.database import SessionLocal, Base, engine
from backend.models import User, Role, Estudiante, Padre
from backend.schemas import MatriculaCreate  # ✅ Nuevo esquema que agrupa estudiante + padres + datos académicos

# ------------------------------------------------------------
# CONFIGURACIÓN GENERAL
# ------------------------------------------------------------

app = FastAPI(title="Gestión 360 API")

# Habilitar CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas automáticamente
Base.metadata.create_all(bind=engine)

# Seguridad: manejo de contraseñas y JWT
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "tu_clave_secreta_aqui_cambiar_en_produccion"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ------------------------------------------------------------
# DEPENDENCIAS Y UTILIDADES
# ------------------------------------------------------------

# Conexión a la base de datos
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


# ------------------------------------------------------------
# SCHEMA INTERNO PARA LOGIN
# ------------------------------------------------------------

from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str


# ------------------------------------------------------------
# RUTAS
# ------------------------------------------------------------

@app.get("/")
def root():
    return {"message": "API funcionando correctamente 🚀"}


# ------------------- LOGIN -------------------
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    # Rol del usuario
    role_name = "sin_rol"
    if user.role:
        role_name = str(user.role.name).lower()

    # Crear token
    token_data = {"sub": user.username, "role": role_name}
    access_token = create_access_token(token_data)

    # Redirección según rol
    redirect_map = {
        "administrador": "/administrador",
        "docente": "/docente",
        "estudiante": "/estudiante",
        "padres": "/padres",
        "padre": "/padres",
    }
    redirect = redirect_map.get(role_name, "/")

    # Actualizar última conexión
    user.last_login = datetime.utcnow()
    user.last_active = datetime.utcnow()
    db.commit()

    return {
        "username": user.username,
        "full_name": user.full_name,
        "rol": role_name,
        "redirect": redirect,
        "access_token": access_token
    }


# ------------------- REGISTRO DE ESTUDIANTE -------------------
@app.post("/register-student", status_code=status.HTTP_201_CREATED)
def register_student(data: MatriculaCreate, db: Session = Depends(get_db)):
    """
    Registro completo de un estudiante (usuario + estudiante + padres)
    """

    # ⚙️ 1️⃣ Verificar si el usuario ya existe (por número de documento)
    existing_user = db.query(User).filter(User.username == data.student.numero_documento).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario con ese número de documento ya existe")

    # ⚙️ 2️⃣ Crear usuario
    hashed_password = pwd_context.hash(data.student.numero_documento)
    role = db.query(Role).filter(Role.name.ilike("estudiante")).first()
    if not role:
        raise HTTPException(status_code=400, detail="No se encontró el rol 'estudiante'")

    new_user = User(
        id=uuid.uuid4(),
        full_name=f"{data.student.nombres} {data.student.apellidos}",
        username=data.student.numero_documento,
        password_hash=hashed_password,
        document_number=data.student.numero_documento,
        role_id=role.id,
        must_change_password=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # ⚙️ 3️⃣ Crear estudiante
    new_student = Estudiante(
        fecha_registro=data.student.fecha_registro,
        nombres=data.student.nombres,
        apellidos=data.student.apellidos,
        fecha_nacimiento=data.student.fecha_nacimiento,
        edad=data.student.edad,
        genero=data.student.genero,
        lugar_nacimiento=data.student.lugar_nacimiento,
        tipo_documento=data.student.tipo_documento,
        numero_documento=data.student.numero_documento,
        telefono=data.student.telefono,
        correo=data.student.correo,
        grado_id=data.student.grado_id,
        grupo=data.student.grupo,
        jornada=data.student.jornada,
        tipo_sangre=data.student.tipo_sangre,
        eps=data.student.eps,
        etnia=data.student.etnia,
        referencia=data.student.referencia,
        direccion=data.student.direccion,
        barrio=data.student.barrio,
        localidad=data.student.localidad,
        zona=data.student.zona,
        user_id=new_user.id
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # ⚙️ 4️⃣ Registrar padres (si existen)
    if data.family:
        if data.family.madre:
            madre = Padre(
                nombres=data.family.madre.nombres,
                apellidos=data.family.madre.apellidos,
                tipo_documento=data.family.madre.tipo_documento,
                numero_documento=data.family.madre.numero_documento,
                telefono=data.family.madre.telefono,
                correo=data.family.madre.correo,
                profesion=data.family.madre.profesion,
                ocupacion=data.family.madre.ocupacion,
                parentesco="Madre",
                estudiante_id=new_student.id
            )
            db.add(madre)

        if data.family.padre:
            padre = Padre(
                nombres=data.family.padre.nombres,
                apellidos=data.family.padre.apellidos,
                tipo_documento=data.family.padre.tipo_documento,
                numero_documento=data.family.padre.numero_documento,
                telefono=data.family.padre.telefono,
                correo=data.family.padre.correo,
                profesion=data.family.padre.profesion,
                ocupacion=data.family.padre.ocupacion,
                parentesco="Padre",
                estudiante_id=new_student.id
            )
            db.add(padre)

    db.commit()

    # ✅ Respuesta final
    return {
        "message": "Estudiante registrado exitosamente",
        "username": new_user.username,
        "id_estudiante": str(new_student.id)
    }
