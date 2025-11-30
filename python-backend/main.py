from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import Optional
import jwt
import uuid
from sqlalchemy import text
from datetime import time
from sqlalchemy import select
from backend.models import MenuDia, MenuSemana



# Importaciones locales
from backend.database import SessionLocal, Base, engine
from backend.models import User, Role, Estudiante, Padre, Docente
from backend.schemas import MatriculaCreate, DocenteCreate, HorarioRequest, GuardarCambiosRequest, SemanaUpdate  
from fastapi.responses import StreamingResponse
from backend.pdf_generator import generate_matricula_pdf, generate_docente_pdf
from backend.event_routes import router as event_router
from backend.routes.docente import router as docente_router




# Configuración General

app = FastAPI(title="Gestión 360 API")

app.include_router(event_router)

app.include_router(docente_router)

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
    return {"message": "API funcionando correctamente "}


# --- LOGIN CORREGIDO ---
@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    role_name = "sin_rol"
    if user.role:
        role_name = str(user.role.name).lower()
        
    grado_id = None   
    username_final = user.username  # 👈 Valor por defecto

    # 🔸 Si es docente, obtener su teacherDocumentNumber real
    if role_name == "docente":
        docente = db.query(Docente).filter(Docente.user_id == user.id).first()
        if docente and docente.teacherDocumentNumber is not None:  # ✅ Aquí se corrige
            username_final = docente.teacherDocumentNumber  # ✅ Esto es un string, no una columna

    # Si es estudiante, obtener grado
    elif role_name == "estudiante":
        estudiante = db.query(Estudiante).filter(Estudiante.user_id == user.id).first()
        if estudiante:
            grado_id = estudiante.grado_id 

    # Token y redirección
    token_data = {"sub": str(user.id), "rol": role_name}
    access_token = create_access_token(token_data)

    redirect_map = {
        "administrador": "/administrador",
        "docente": "/docente",
        "estudiante": "/estudiante",
        "padres": "/padres",
        "padre": "/padres",
    }
    redirect = redirect_map.get(role_name, "/")

    user.last_login = datetime.utcnow()
    user.last_active = datetime.utcnow()
    db.commit()

    return {
        "username": username_final,
        "user_id": str(user.id),  
        "full_name": user.full_name,
        "rol": role_name,
        "redirect": redirect,
        "access_token": access_token,
        "grado_id": grado_id 
    }

# --- MODULO ADMINISTRADOR --- #

#-- Registro estudiante -- #
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
    
    
# -- Registrar docente -- #  
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
    
# -- Editar docente -- # 
@app.get("/api/docentes")
def get_docentes(db: Session = Depends(get_db)):
    docentes = db.query(Docente).all()
    return [
        {
            "id": d.id,
            "registerDate": d.registerDate,
            "codigo": d.codigo,
            "teacherName": d.teacherName,
            "teacherLastname": d.teacherLastname,
            "teacherBirthDate": d.teacherBirthDate,
            "teacherAge": d.teacherAge,
            "teacherGender": d.teacherGender,
            "teacherBirthPlace": d.teacherBirthPlace,
            "teacherDocument": d.teacherDocument,
            "teacherDocumentNumber": d.teacherDocumentNumber,
            "teacherPhone": d.teacherPhone,
            "teacherEmail": d.teacherEmail,
            "teacherProfession": d.teacherProfession,
            "teacherArea": d.teacherArea,
            "teacherResolutionNumber": d.teacherResolutionNumber,
            "teacherScale": d.teacherScale,
            "photo": d.photo,
        }
        for d in docentes
    ]  

# -- Generar PDF docente -- #    
@app.get("/docente-pdf/{docente_id}")
def download_docente_pdf(docente_id: int, db: Session = Depends(get_db)):
    docente = db.query(Docente).filter(Docente.id == docente_id).first()
    if not docente:
        raise HTTPException(status_code=404, detail="Docente no encontrado")

    data = {
        "docente": {
            "teacherName": docente.teacherName,
            "teacherLastname": docente.teacherLastname,
            "codigo": docente.codigo,
            "registerDate": docente.registerDate,
            "teacherBirthDate": docente.teacherBirthDate,
            "teacherAge": docente.teacherAge,
            "teacherGender": docente.teacherGender,
            "teacherBirthPlace": docente.teacherBirthPlace,
            "teacherDocument": docente.teacherDocument,
            "teacherDocumentNumber": docente.teacherDocumentNumber,
            "teacherPhone": docente.teacherPhone,
            "teacherEmail": docente.teacherEmail,
            "teacherProfession": docente.teacherProfession,
            "teacherArea": docente.teacherArea,
            "teacherResolutionNumber": docente.teacherResolutionNumber,
            "teacherScale": docente.teacherScale,
            "photo": docente.photo,
        }
    }

    pdf_buffer = generate_docente_pdf(data)
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=docente_{docente.teacherDocumentNumber}.pdf"}
    )
 
 
 #-- Crear horario -- #   
@app.post("/api/horarios")
def guardar_horario(horario: HorarioRequest, db: Session = Depends(get_db)):
    try:
        # 1. Obtener grade_id desde grados.nombre
        res = db.execute(
            text("SELECT id FROM grados WHERE nombre = :n"),
            {"n": horario.grado_nombre}
        ).fetchone()
        if not res:
            raise HTTPException(status_code=400, detail="Grado no encontrado")
        grade_id = res[0]

        # 2. Validar que el docente exista
        res = db.execute(
            text("SELECT id FROM docentes WHERE id = :id"),
            {"id": horario.docente_id}
        ).fetchone()
        if not res:
            raise HTTPException(status_code=400, detail="Docente no encontrado")

        # 3. Limpiar horarios anteriores del mismo docente y grado (opcional)
        db.execute(
            text("DELETE FROM horarios WHERE grade_id = :g AND teacher_id = :t"),
            {"g": grade_id, "t": horario.docente_id}
        )

        # 4. Insertar las nuevas asignaciones
        for fila in horario.filas:
            for item in fila.dias:
                if item.materia:
                    # Buscar subject_id por nombre
                    res = db.execute(
                        text("SELECT subject_id FROM asignaturas WHERE name = :name"),
                        {"name": item.materia}
                    ).fetchone()
                    if not res:
                        raise HTTPException(status_code=400, detail=f"Asignatura no encontrada: {item.materia}")
                    subject_id = res[0]

                    db.execute(
                        text("""
                            INSERT INTO horarios (grade_id, teacher_id, day_of_week, start_time, end_time, subject_id)
                            VALUES (:grade_id, :teacher_id, :day, :inicio, :fin, :subject_id)
                        """),
                        {
                            "grade_id": grade_id,
                            "teacher_id": horario.docente_id,
                            "day": item.dia,
                            "inicio": time.fromisoformat(fila.inicio),
                            "fin": time.fromisoformat(fila.fin),
                            "subject_id": subject_id,
                        }
                    )
        db.commit()
        return {"mensaje": "Horario guardado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
# -- Listar grados dentro de horario -- #
@app.get("/api/grados")
def get_grados(db: Session = Depends(get_db)):
    try:
        # Obtener todos los grados ordenados por id
        grados = db.execute(text("SELECT id, nombre FROM grados ORDER BY id")).fetchall()
        return [
            {
                "id": g[0],
                "nombre": g[1]
            }
            for g in grados
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
# -- listar docentes dentro del horario -- #   
@app.get("/api/docentes-select")
def get_docentes_select(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("""
            SELECT id, "teacherName", "teacherLastname"
            FROM docentes
            ORDER BY
                COALESCE("teacherName", ''),
                COALESCE("teacherLastname", '')
        """)).fetchall()
        
        docentes = []
        for row in result:
            id_doc = row[0]
            name = row[1] if row[1] is not None else ""
            lastname = row[2] if row[2] is not None else ""
            nombre_completo = f"{name} {lastname}".strip()
            if not nombre_completo:
                nombre_completo = f"Docente {id_doc}"
            docentes.append({
                "id": id_doc,
                "nombre_completo": nombre_completo
            })
        
        return docentes
    except Exception as e:
        print("Error en /api/docentes-select:", str(e))
        raise HTTPException(status_code=500, detail="Error al cargar docentes")
    
# -- Editar horario -- #
@app.get("/api/horarios")
def get_horarios_por_grado_docente(
    grado_id: int, 
    docente_id: int, 
    db: Session = Depends(get_db)
):
    try:
        # Obtener nombre del grado para validar
        grado_res = db.execute(text("SELECT nombre FROM grados WHERE id = :id"), {"id": grado_id}).fetchone()
        if not grado_res:
            raise HTTPException(status_code=404, detail="Grado no encontrado")
        grado_nombre = grado_res[0]

        # Obtener horarios
        rows = db.execute(text("""
            SELECT h.day_of_week, h.start_time, h.end_time, a.name
            FROM horarios h
            JOIN asignaturas a ON h.subject_id = a.subject_id
            WHERE h.grade_id = :grado_id AND h.teacher_id = :docente_id
            ORDER BY h.start_time, h.day_of_week
        """), {
            "grado_id": grado_id,
            "docente_id": docente_id
        }).fetchall()

        # Agrupar por bloques de hora
        bloques = {}
        for dia, inicio, fin, materia in rows:
            key = f"{inicio}_{fin}"
            if key not in bloques:
                bloques[key] = {
                    "inicio": str(inicio),
                    "fin": str(fin),
                    "dias": {"Lunes": "", "Martes": "", "Miércoles": "", "Jueves": "", "Viernes": ""}
                }
            bloques[key]["dias"][dia] = materia

        return {
            "grado_nombre": grado_nombre,
            "filas": list(bloques.values())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))   


    
@app.get("/api/grados-con-horarios")
def get_grados_con_horarios(db: Session = Depends(get_db)):
    try:
        # Obtener grados que tengan al menos un horario asignado
        result = db.execute(text("""
            SELECT DISTINCT g.id, g.nombre
            FROM grados g
            JOIN horarios h ON g.id = h.grade_id
            ORDER BY g.id
        """)).fetchall()

        return [
            {
                "id": row[0],
                "nombre": row[1]
            }
            for row in result
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

@app.get("/api/horarios/grado/{grado_id}")
def ver_horario_por_grado(grado_id: int, db: Session = Depends(get_db)):
    try:
        # Validar grado
        grado_row = db.execute(text("SELECT nombre FROM grados WHERE id = :id"), {"id": grado_id}).fetchone()
        if not grado_row:
            raise HTTPException(status_code=404, detail="Grado no encontrado")
        grado_nombre = grado_row[0]

        # Obtener horarios
        rows = db.execute(text("""
            SELECT h.day_of_week, h.start_time, h.end_time, a.name
            FROM horarios h
            JOIN asignaturas a ON h.subject_id = a.subject_id
            WHERE h.grade_id = :grado_id
            ORDER BY h.start_time, h.day_of_week
        """), {"grado_id": grado_id}).fetchall()

        if not rows:
            return {"grado_nombre": grado_nombre, "filas": []}

        # Agrupar por bloques
        bloques = {}
        for dia, inicio, fin, materia in rows:
            key = f"{inicio}_{fin}"
            if key not in bloques:
                bloques[key] = {
                    "inicio": str(inicio),
                    "fin": str(fin),
                    "dias": {"Lunes": "", "Martes": "", "Miércoles": "", "Jueves": "", "Viernes": ""}
                }
            bloques[key]["dias"][dia] = materia

        return {
            "grado_nombre": grado_nombre,
            "filas": list(bloques.values())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    

# -- Eliminar horarios de la base de datos --
@app.delete("/api/horarios/grado/{grado_id}")
def eliminar_horario_por_grado(grado_id: int, db: Session = Depends(get_db)):
    try:
        # Verificar que el grado exista
        res = db.execute(text("SELECT id FROM grados WHERE id = :id"), {"id": grado_id}).fetchone()
        if not res:
            raise HTTPException(status_code=404, detail="Grado no encontrado")

        # Eliminar todos los horarios de ese grado
        db.execute(text("DELETE FROM horarios WHERE grade_id = :grado_id"), {"grado_id": grado_id})
        db.commit()
        return {"mensaje": f"Horario del grado {grado_id} eliminado correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) 
    
       

# -- Editar menú --  
@app.post("/api/guardar_cambios")
def guardar_cambios_menu(request: GuardarCambiosRequest, db: Session = Depends(get_db)):
    try:
        # Buscar el plato exacto usando select() y ORM
        stmt = select(MenuDia).where(
            MenuDia.dia == request.dia,
            MenuDia.categoria == request.categoria,
            MenuDia.nombre == request.platoOriginal.nombre,
            MenuDia.img == request.platoOriginal.img
        )
        plato = db.execute(stmt).scalar_one_or_none()

        if not plato:
            raise HTTPException(status_code=404, detail="Plato no encontrado")

        # Actualizar campos
        plato.nombre = request.platoNuevo.nombre
        plato.img = request.platoNuevo.img

        db.commit()
        return {"success": True}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al guardar cambios")


@app.get("/api/menu")
def get_menu(db: Session = Depends(get_db)):
    try:
        # Obtener todos los platos ordenados por día y categoría
        stmt = select(MenuDia).order_by(MenuDia.dia, MenuDia.categoria)
        result = db.execute(stmt)
        platos = result.scalars().all()

        # Estructurar los datos como menuData
        menu = {}
        for plato in platos:
            if plato.dia not in menu:
                menu[plato.dia] = {}
            if plato.categoria not in menu[plato.dia]:
                menu[plato.dia][plato.categoria] = []
            menu[plato.dia][plato.categoria].append({
                "nombre": plato.nombre,
                "img": plato.img
            })

        return menu

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al cargar el menú")
 

@app.get("/api/semana")
def get_semana(db: Session = Depends(get_db)):
    semana = db.execute(select(MenuSemana)).scalar_one_or_none()
    if not semana:
        # Si no existe, crea un valor por defecto
        semana = MenuSemana(descripcion="Semana no configurada")
        db.add(semana)
        db.commit()
    return {"descripcion": semana.descripcion}

@app.put("/api/semana")
def update_semana(request: SemanaUpdate, db: Session = Depends(get_db)):
    semana = db.execute(select(MenuSemana)).scalar_one_or_none()
    if not semana:
        semana = MenuSemana(descripcion=request.descripcion)
        db.add(semana)
    else:
        semana.descripcion = request.descripcion
    db.commit()
    return {"success": True}