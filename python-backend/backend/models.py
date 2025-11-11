from __future__ import annotations
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, Boolean, BigInteger, TIMESTAMP
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
