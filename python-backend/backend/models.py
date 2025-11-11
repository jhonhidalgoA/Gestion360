from __future__ import annotations
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, Boolean, BigInteger, TIMESTAMP, Column, Integer, String, Date, ForeignKey, Text
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
    parentesco = Column(String(20))  # Ej: "Madre", "Padre", "Acudiente"

    # 🔗 Relación con estudiante
    estudiante_id = Column(ForeignKey("estudiantes.id", ondelete="CASCADE"))
    estudiante = relationship("Estudiante", backref="padres")

    def __repr__(self):
        return f"<Padre(id={self.id}, nombre={self.nombres} {self.apellidos}, parentesco={self.parentesco})>"
    