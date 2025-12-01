from backend.database import SessionLocal
from backend.models import User, Role, Padre
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = SessionLocal()

# 1. Crear rol "Padre" si no existe
padre_role = db.query(Role).filter(Role.name == "Padre").first()
if not padre_role:
    padre_role = Role(name="Padre", description="Rol de acudiente")
    db.add(padre_role)
    db.commit()
    db.refresh(padre_role)
    print("Rol 'Padre' creado.")

# 2. Crear usuario "padre"
hashed_password = pwd_context.hash("padre123")

existing_user = db.query(User).filter(User.username == "padre").first()

if not existing_user:
    padre_user = User(
        full_name="Padre de Familia",
        username="padre",
        password_hash=hashed_password,
        document_number=2000000000,
        email="padre@example.com",
        role_id=padre_role.id
    )

    db.add(padre_user)
    db.commit()
    db.refresh(padre_user)
    print("Usuario 'padre' creado correctamente.")

    # 3. Crear registro en tabla Padre
    padre_record = Padre(
        user_id=padre_user.id,
        nombres="Padre",
        apellidos="Familia",
        tipo_documento="CC",
        numero_documento="2000000000",
        telefono="3000000000",
        correo="padre@example.com",
        profesion="N/A",
        ocupacion="N/A",
        parentesco="Padre",
        estudiante_id=None   # si todavía no tienes estudiante asociado
    )
    db.add(padre_record)
    db.commit()
    print("Registro en tabla Padre creado.")

else:
    print("⚠️ El usuario 'padre' ya existe.")

db.close()
