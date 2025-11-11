from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import uuid

# Schema para crear usuario
class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str
    email: Optional[str]

# Schema para mostrar usuario
class UserRead(BaseModel):
    id: uuid.UUID
    username: str
    full_name: str
    email: Optional[str]

    class Config:
        orm_mode = True

# Schema para roles
class RoleRead(BaseModel):
    id: int
    name: str
    description: Optional[str]

    class Config:
        orm_mode = True

# --- Esquema para padres o acudientes ---
class ParentCreate(BaseModel):
    nombres: Optional[str] = None
    apellidos: Optional[str] = None
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[EmailStr] = None
    profesion: Optional[str] = None
    ocupacion: Optional[str] = None
    parentesco: Optional[str] = None  # "Madre" o "Padre"

# --- Esquema para registrar un estudiante ---
class StudentRegister(BaseModel):
    
    fecha_registro: Optional[str] = None  # YYYY-MM-DD
    foto: Optional[str] = None
    nombres: str
    apellidos: str
    username: Optional[str] = None
    fecha_nacimiento: Optional[str] = None  # YYYY-MM-DD
    edad: Optional[int] = None
    genero: Optional[str] = None
    lugar_nacimiento: Optional[str] = None
    tipo_documento: Optional[str] = None
    numero_documento: str
    telefono: Optional[str] = None
    correo: Optional[EmailStr] = None
    grado_id: Optional[int] = None
    grupo: Optional[str] = None
    jornada: Optional[str] = None
    tipo_sangre: Optional[str] = None
    eps: Optional[str] = None
    etnia: Optional[str] = None
    referencia: Optional[str] = None
    direccion: Optional[str] = None
    barrio: Optional[str] = None
    localidad: Optional[str] = None
    zona: Optional[str] = None

    madre: Optional[ParentCreate] = None
    padre: Optional[ParentCreate] = None

    username: Optional[str] = None
    password: Optional[str] = None