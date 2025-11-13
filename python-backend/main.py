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
from backend.models import User, Role, Estudiante, Padre, Docente
from backend.schemas import MatriculaCreate, DocenteCreate  
from fastapi.responses import StreamingResponse
from backend.pdf_generator import generate_matricula_pdf


# Configuración General


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


from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str


# Rutas

@app.get("/")
def root():
    return {"message": "API funcionando correctamente 🚀"}



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


# Registro estudiante
@app.post("/register-student", status_code=status.HTTP_201_CREATED)
def register_student(data: MatriculaCreate, db: Session = Depends(get_db)):
    

    # Verificar si el usuario ya existe (por número de documento)
    existing_user = db.query(User).filter(User.username == data.student.numero_documento).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El usuario con ese número de documento ya existe")

    # Crear usuario
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

    # Crear estudiante
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
        user_id=new_user.id,
        foto=data.student.foto,
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Registrar padres 
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
   
    return {
        "message": "Estudiante registrado exitosamente",
        "username": new_user.username,
        "id_estudiante": str(new_student.id)
    }
    

@app.get("/matriculas")
def get_all_matriculas(db: Session = Depends(get_db)):
    estudiantes = db.query(Estudiante).all()
    matriculas = []

    for est in estudiantes:
        padres = db.query(Padre).filter(Padre.estudiante_id == est.id).all()
        madre = None
        padre = None

        for p in padres:
            parentesco_str = str(p.parentesco) if p.parentesco is not None else ""
            if parentesco_str.strip().lower() == "madre":
                madre = p
            elif parentesco_str.strip().lower() == "padre":
                padre = p

        # Forzar a int
        grado_id_val = getattr(est, "grado_id", None)
        grado_id_int = int(grado_id_val) if isinstance(grado_id_val, (int, float)) else -1

        grado_nombre = {
            0: "preescolar",
            1: "primero",
            2: "segundo",
            3: "tercero",
            4: "cuarto",
            5: "quinto",
            6: "sexto",
            7: "septimo",
            8: "octavo",
            9: "noveno",
            10: "decimo",
            11: "undecimo"
        }.get(grado_id_int, "Sin asignar")

        grupo_str = str(est.grupo) if est.grupo is not None else ""
        grado_display = f"{grado_nombre} - {grupo_str}" if grupo_str else grado_nombre

        matricula = {
            "id": str(est.id),
            "student": {
                "nombres": est.nombres,
                "apellidos": est.apellidos,
                "fecha_nacimiento": est.fecha_nacimiento,
                "edad": est.edad,
                "genero": est.genero,
                "lugar_nacimiento": est.lugar_nacimiento,
                "tipo_documento": est.tipo_documento,
                "numero_documento": est.numero_documento,
                "telefono": est.telefono,
                "correo": est.correo,
                "grado_id": est.grado_id,
                "grupo": est.grupo,
                "jornada": est.jornada,
                "tipo_sangre": est.tipo_sangre,
                "eps": est.eps,
                "etnia": est.etnia,
                "referencia": est.referencia,
                "direccion": est.direccion,
                "barrio": est.barrio,
                "localidad": est.localidad,
                "zona": est.zona,
                "foto": est.foto,
                "grade": grado_display
            },
            "family": {
                "madre": {
                    "nombres": madre.nombres if madre else "",
                    "apellidos": madre.apellidos if madre else "",
                    "tipo_documento": madre.tipo_documento if madre else "",
                    "numero_documento": madre.numero_documento if madre else "",
                    "telefono": madre.telefono if madre else "",
                    "correo": madre.correo if madre else "",
                    "profesion": madre.profesion if madre else "",
                    "ocupacion": madre.ocupacion if madre else "",
                    "parentesco": "Madre"
                } if madre else None,
                "padre": {
                    "nombres": padre.nombres if padre else "",
                    "apellidos": padre.apellidos if padre else "",
                    "tipo_documento": padre.tipo_documento if padre else "",
                    "numero_documento": padre.numero_documento if padre else "",
                    "telefono": padre.telefono if padre else "",
                    "correo": padre.correo if padre else "",
                    "profesion": padre.profesion if padre else "",
                    "ocupacion": padre.ocupacion if padre else "",
                    "parentesco": "Padre"
                } if padre else None
            }
        }

        matriculas.append(matricula)
    return matriculas



@app.put("/student/{student_id}", status_code=status.HTTP_200_OK)
def update_student(student_id: int, data: MatriculaCreate, db: Session = Depends(get_db)):
    # Buscar estudiante
    estudiante = db.query(Estudiante).filter(Estudiante.id == student_id).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    # Verificar si otro estudiante ya usa ese documento (excluyendo al actual)
    existing = db.query(Estudiante).filter(
        Estudiante.numero_documento == data.student.numero_documento,
        Estudiante.id != student_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Número de documento ya en uso")

    # Actualizar estudiante
    for key, value in data.student.dict().items():
        if key != "password":  # no se actualiza password aquí
            setattr(estudiante, key, value)

    # Actualizar padres
    if data.family:
        # Eliminar padres actuales
        db.query(Padre).filter(Padre.estudiante_id == student_id).delete()

        # Crear nuevos
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
                estudiante_id=student_id
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
                estudiante_id=student_id
            )
            db.add(padre)

    db.commit()
    db.refresh(estudiante)

    return {
        "message": "Estudiante actualizado exitosamente",
        "id_estudiante": str(estudiante.id)
    }
    
@app.get("/matricula-pdf/{student_id}")
def download_matricula_pdf(student_id: int, db: Session = Depends(get_db)):    
    estudiante = db.query(Estudiante).filter(Estudiante.id == student_id).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
   
    estudiante = db.query(Estudiante).filter(Estudiante.id == student_id).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    padres = db.query(Padre).filter(Padre.estudiante_id == student_id).all()
    madre = None
    padre = None

    for p in padres:
        parentesco_str = str(p.parentesco) if p.parentesco is not None else ""
        if parentesco_str.strip().lower() == "madre":
            madre = p
        elif parentesco_str.strip().lower() == "padre":
            padre = p

    grado_map = {
        0: "preescolar",
        1: "primero",
        2: "segundo",
        3: "tercero",
        4: "cuarto",
        5: "quinto",
        6: "sexto",
        7: "septimo",
        8: "octavo",
        9: "noveno",
        10: "decimo",
        11: "undecimo"
    }

    # Convertir grado_id a int seguro
    grado_id_int = int(estudiante.grado_id) if estudiante.grado_id is not None else -1  # type: ignore
    grado_nombre = grado_map.get(grado_id_int, "Sin asignar")

    # Convertir grupo a string seguro
    grupo_str = str(estudiante.grupo) if estudiante.grupo is not None else ""
    grado_display = f"{grado_nombre} - {grupo_str}" if grupo_str else grado_nombre

    data = {
        "student": {
            "nombres": estudiante.nombres,
            "apellidos": estudiante.apellidos,
            "tipo_documento": estudiante.tipo_documento,
            "numero_documento": estudiante.numero_documento,
            "fecha_nacimiento": estudiante.fecha_nacimiento,
            "edad": estudiante.edad,
            "genero": estudiante.genero,
            "lugar_nacimiento": estudiante.lugar_nacimiento,
            "telefono": estudiante.telefono,
            "correo": estudiante.correo,
            "jornada": estudiante.jornada,
            "grupo": estudiante.grupo,
            "grade": grado_display,
            "direccion": estudiante.direccion,
            "barrio": estudiante.barrio,
            "localidad": estudiante.localidad,
            "zona": estudiante.zona,
            "eps": estudiante.eps,
            "tipo_sangre": estudiante.tipo_sangre,
            "foto": estudiante.foto,
        },
        "family": {
            "madre": {
                "nombres": madre.nombres,
                "apellidos": madre.apellidos,
                "numero_documento": madre.numero_documento,
                "telefono": madre.telefono,
                "correo": madre.correo,
                "ocupacion": madre.ocupacion,
            } if madre else None,
            "padre": {
                "nombres": padre.nombres,
                "apellidos": padre.apellidos,
                "numero_documento": padre.numero_documento,
                "telefono": padre.telefono,
                "correo": padre.correo,
                "ocupacion": padre.ocupacion,
            } if padre else None
        }
    }

    pdf_buffer = generate_matricula_pdf(data)
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=matricula_{estudiante.numero_documento}.pdf"}
    )
    
@app.post("/api/docentes", status_code=status.HTTP_201_CREATED)
def registrar_docente(data: DocenteCreate, db: Session = Depends(get_db)):
    
    # Verificar si ya existe un usuario con ese número de documento
    existing_user = db.query(User).filter(User.username == data.teacherDocumentNumber).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Número de documento ya registrado")

    # Buscar rol 'docente'
    role = db.query(Role).filter(Role.name.ilike("docente")).first()
    if not role:
        raise HTTPException(status_code=400, detail="No se encontró el rol 'docente' en la base de datos")

    # Crear usuario
    hashed_password = pwd_context.hash(data.teacherDocumentNumber)
    new_user = User(
        id=uuid.uuid4(),
        full_name=f"{data.teacherName} {data.teacherLastname}",
        username=data.teacherDocumentNumber,
        password_hash=hashed_password,
        document_number=data.teacherDocumentNumber,
        role_id=role.id,
        must_change_password=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    
    new_docente = Docente(
        registerDate=data.registerDate,
        codigo=data.codigo,
        teacherName=data.teacherName,
        teacherLastname=data.teacherLastname,
        teacherBirthDate=data.teacherBirthDate,
        teacherAge=data.teacherAge,
        teacherGender=data.teacherGender,
        teacherBirthPlace=data.teacherBirthPlace,
        teacherDocument=data.teacherDocument,
        teacherDocumentNumber=data.teacherDocumentNumber,
        teacherPhone=data.teacherPhone,
        teacherEmail=data.teacherEmail,
        teacherProfession=data.teacherProfession,
        teacherArea=data.teacherArea,
        teacherResolutionNumber=data.teacherResolutionNumber,
        teacherScale=data.teacherScale,
        photo=data.photo,
        user_id=new_user.id
    )
    db.add(new_docente)
    db.commit()
    db.refresh(new_docente)

    return {
        "message": "Docente registrado exitosamente",
        "username": new_user.username,
        "id_usuario": str(new_user.id),
        "id_docente": new_docente.id
    }    
    