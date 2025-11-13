from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date


# --- MODELO: Padre o acudiente ---
class ParentCreate(BaseModel):
    nombres: str
    apellidos: str
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[EmailStr] = None
    profesion: Optional[str] = None
    ocupacion: Optional[str] = None
    parentesco: Optional[str] = None  

    class Config:
        orm_mode = True


# --- MODELO: Datos académicos ---
class AcademicData(BaseModel):
    direccion: Optional[str] = None
    barrio: Optional[str] = None
    localidad: Optional[str] = None
    zona: Optional[str] = None
    estado: Optional[str] = None  # Activo, Retirado, etc.

    class Config:
        orm_mode = True


# --- MODELO: Estudiante ---
class StudentRegister(BaseModel):
    fecha_registro: Optional[date] = None
    nombres: str
    apellidos: str
    fecha_nacimiento: Optional[date] = None
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
    password: Optional[str] = None  
    foto: Optional[str] = None

    class Config:
        orm_mode = True


# --- MODELO: Agrupa datos familiares ---
class FamilyData(BaseModel):
    madre: Optional[ParentCreate] = None
    padre: Optional[ParentCreate] = None

    class Config:
        orm_mode = True


# Matrícula completa-
class MatriculaCreate(BaseModel):
    student: StudentRegister
    family: Optional[FamilyData] = None
    academic: Optional[AcademicData] = None

    class Config:
        orm_mode = True
        
    
# --- MODELO: Docente --- 
class DocenteCreate(BaseModel):
    registerDate: str
    codigo: str
    teacherName: str
    teacherLastname: str
    teacherBirthDate: str
    teacherAge: str
    teacherGender: str
    teacherBirthPlace: str
    teacherDocument: str
    teacherDocumentNumber: str
    teacherPhone: str
    teacherEmail: str
    teacherProfession: str
    teacherArea: str
    teacherResolutionNumber: str
    teacherScale: str
    photo: Optional[str] = None  # base64

    class Config:
        orm_mode = True        
        
class MateriaDia(BaseModel):
    dia: str
    materia: str | None

class FilaHorario(BaseModel):
    inicio: str
    fin: str
    dias: List[MateriaDia]

class HorarioRequest(BaseModel):
    grado_nombre: str
    docente_id: int
    filas: List[FilaHorario]       
    
        