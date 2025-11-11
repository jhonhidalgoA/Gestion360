from backend.database import SessionLocal
from backend.models import User, Role
from passlib.context import CryptContext

# Configurar el contexto para encriptar contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Crear una sesión
db = SessionLocal()

# Crear un rol de administrador si no existe
admin_role = db.query(Role).filter(Role.name == "Administrador").first()
if not admin_role:
    admin_role = Role(name="Administrador", description="Rol con privilegios administrativos")
    db.add(admin_role)
    db.commit()
    db.refresh(admin_role)

# Crear usuario administrador
hashed_password = pwd_context.hash("admin123")

admin_user = User(
    full_name="Administrador General",
    username="admin",
    password_hash=hashed_password,
    document_number=1000000000,
    email="admin@example.com",
    role_id=admin_role.id
)

# Verificar si ya existe
existing_user = db.query(User).filter(User.username == "admin").first()
if not existing_user:
    db.add(admin_user)
    db.commit()
    print("✅ Usuario administrador creado correctamente.")
else:
    print("⚠️ El usuario administrador ya existe.")

db.close()
