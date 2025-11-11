from pydantic import BaseModel
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
