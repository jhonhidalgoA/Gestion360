from pydantic import BaseModel, EmailStr, field_serializer
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID


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
    
# --- MODELO: Evento del calendario ---
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    color: str = "#3498db"

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime

    @field_serializer('created_at', 'updated_at')
    def serialize_dt(self, dt: datetime, _info):
        return dt.isoformat()

    class Config:
        from_attributes = True   
        
class PlatoOriginal(BaseModel):
    nombre: str
    img: str

class PlatoNuevo(BaseModel):
    nombre: str
    img: str

class GuardarCambiosRequest(BaseModel):
    dia: str
    categoria: str
    platoOriginal: PlatoOriginal
    platoNuevo: PlatoNuevo        
    
class SemanaUpdate(BaseModel):
    descripcion: str  
    
class DuracionClaseBase(BaseModel):
    valor: int
    etiqueta: str

class DuracionClaseResponse(DuracionClaseBase):
    id: UUID

    class Config:
        from_attributes = True      
        
class AsistenciaEstudiante(BaseModel):
    id: int
    asistencia: List[str]  # 7 estados: ["P", "A", "R", ...]

class AsistenciaGuardarRequest(BaseModel):
    grupo: str
    asignatura: str
    periodo: str
    duracion: str
    estudiantes: List[AsistenciaEstudiante]
    
class TareaBase(BaseModel):
    grupo_id: int
    asignatura: str
    tema: str
    descripcion: str
    url: Optional[str] = None
    archivo: str | None = None
    fecha_inicio: date
    fecha_fin: date
class TareaCreate(TareaBase):
    pass

class TareaResponse(TareaBase):
    id: str
    archivo: Optional[str] = None

    class Config:
        from_attributes = True

class TareaEstudianteCreate(BaseModel):
    estudiante_id: int

class TareaConEstudiantesCreate(TareaBase):
    estudiantes: List[int]    
    

class AsignaturaBoletin(BaseModel):
    nombre_asignatura: str
    area: str
    hours_per_week: int
    nota_promedio: float | None = None
    estado: str  # Ej: "✓ Aprobado", "✗ Reprobado", "Pendiente"
    fallas: int

    class Config:
        from_attributes = True  # Reemplaza orm_mode (Pydantic v2)


# --- MODELO: Estudiante en boletín ---
class EstudianteBoletin(BaseModel):
    nombre: str
    documento: str
    grado: str
    periodo: str

    class Config:
        from_attributes = True


# --- MODELO: Respuesta completa del boletín ---
class BoletinCompletoResponse(BaseModel):
    estudiante: EstudianteBoletin
    asignaturas: list[AsignaturaBoletin]

    class Config:
        from_attributes = True    