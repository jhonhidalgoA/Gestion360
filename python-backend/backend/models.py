from __future__ import annotations
import uuid
from sqlalchemy import String, UUID as PG_UUID
from datetime import datetime, date
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, Boolean, BigInteger, TIMESTAMP, Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base



class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    users: Mapped[List["User"]] = relationship(
        back_populates="role", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"Role(id={self.id!r}, name={self.name!r})"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    username: Mapped[str] = mapped_column(String(54), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    document_number: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(100), unique=True)
    must_change_password: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    session_token: Mapped[Optional[str]] = mapped_column(String(64))
    last_active: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True), default=datetime.utcnow)

    role_id: Mapped[Optional[int]] = mapped_column(ForeignKey("roles.id"))
    role: Mapped[Optional["Role"]] = relationship(back_populates="users")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, username={self.username!r}, role_id={self.role_id!r})"

class Estudiante(Base):
    __tablename__ = "estudiantes"

    id = Column(Integer, primary_key=True, index=True)    
    fecha_registro = Column(Date)
    nombres = Column(String(100))
    apellidos = Column(String(100))
    fecha_nacimiento = Column(Date)
    edad = Column(Integer)
    genero = Column(String(20))
    lugar_nacimiento = Column(String(100))
    tipo_documento = Column(String(30))
    numero_documento = Column(String(30), unique=True)
    telefono = Column(String(20))
    correo = Column(String(100))
    grado_id = Column(Integer)
    grupo = Column(String(10))
    jornada = Column(String(20))
    tipo_sangre = Column(String(10))
    eps = Column(String(50))
    etnia = Column(String(50))
    referencia = Column(String(100))
    direccion = Column(String(100))
    barrio = Column(String(100))
    localidad = Column(String(100))
    zona = Column(String(50))
    foto = Column(String(500)) 

    # Relación con usuario
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"))
    user = relationship("User", backref="estudiante")
    
class Padre(Base):
    __tablename__ = "padres"

    id = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    tipo_documento = Column(String(30))
    numero_documento = Column(String(30))
    telefono = Column(String(20))
    correo = Column(String(100))
    profesion = Column(String(100))
    ocupacion = Column(String(100))
    parentesco = Column(String(20)) 

    # 🔗 Relación con estudiante
    estudiante_id = Column(ForeignKey("estudiantes.id", ondelete="CASCADE"))
    estudiante = relationship("Estudiante", backref="padres")

    def __repr__(self):
        return f"<Padre(id={self.id}, nombre={self.nombres} {self.apellidos}, parentesco={self.parentesco})>"
    
class Docente(Base):
    __tablename__ = "docentes"

    id = Column(Integer, primary_key=True, index=True)
    registerDate = Column(String(10))      
    codigo = Column(String(50), unique=True, nullable=False)
    teacherName = Column(String(100))
    teacherLastname = Column(String(100))
    teacherBirthDate = Column(String(10))
    teacherAge = Column(String(10))
    teacherGender = Column(String(20))
    teacherBirthPlace = Column(String(100))
    teacherDocument = Column(String(30))
    teacherDocumentNumber = Column(String(30), unique=True)
    teacherPhone = Column(String(20))
    teacherEmail = Column(String(100))
    teacherProfession = Column(String(100))
    teacherArea = Column(String(100))
    teacherResolutionNumber = Column(String(100))
    teacherScale = Column(String(50))
    photo = Column(Text)

    # Relación con usuario
    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    user = relationship("User", backref="docente")    
class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, default=None)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    color: Mapped[str] = mapped_column(String(7), default="#3498db")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:
        return f"Event(id={self.id!r}, title={self.title!r}, start_date={self.start_date!r})"

class MenuDia(Base):
    __tablename__ = "menu_dia"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    dia: Mapped[str] = mapped_column(String(20), nullable=False)
    categoria: Mapped[str] = mapped_column(String(50), nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    img: Mapped[str] = mapped_column(String(100), nullable=False)    
   
class MenuSemana(Base):
    __tablename__ = "menu_semana"
    id: Mapped[int] = mapped_column(primary_key=True)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)


class Grado(Base):
    __tablename__ = "grados"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

class Asignatura(Base):
    __tablename__ = "asignaturas"
    subject_id: Mapped[int] = mapped_column("subject_id", primary_key=True)
    name: Mapped[str] = mapped_column("name", String(100), nullable=False)

class Periodo(Base):
    __tablename__ = "periodos"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)    
    

    