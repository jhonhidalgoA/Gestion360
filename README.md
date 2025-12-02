## GESTIÓN 360 – PLATAFORMA ESCOLAR INTEGRAL

<p align="justify"> Gestión 360 es una plataforma escolar desarrollada para optimizar y centralizar la gestión académica y administrativa de instituciones educativas. Su diseño integra calificaciones, asistencia, horarios, tareas, comunicación y reportes en un solo sistema web moderno, escalable y seguro. </p>

🚀 CARACTERÍSTICAS PRINCIPALES
<p align="justify"> La plataforma está organizada en módulos que permiten una administración integral de la información académica. </p>

✔ MÓDULO ADMINISTRADOR

* Registro de estudiantes
* Registro de docentes
* Generación de horarios por grado y por docente
* Calendario escolar
* Menú escolar
* Gestión institucional

✔ MÓDULO DOCENTE

* Registro y consulta de calificaciones
* Registro de asistencia
* Planeación académica
* Enviar actividades y tareas
* Comunicación con padres
* Generación de reportes académicos

✔ MÓDULO ESTUDIANTE

* Consulta del horario
* Visualización de calificaciones en tiempo real
* Gestión de tareas pendientes
* Acceso a recursos educativos

🎨 INTERFAZ DE USUARIO – DISEÑO EN ADOBE XD
<p align="justify"> Antes del desarrollo, todas las pantallas del sistema fueron prototipadas en Adobe XD para asegurar una interfaz moderna, intuitiva y fácil de usar. El proceso permitió validar flujos, corregir errores de navegación y mantener coherencia visual entre los módulos. </p>

🏗️ ARQUITECTURA DEL SISTEMA
<p align="justify"> La plataforma Gestión 360 está construida bajo una arquitectura cliente-servidor moderna que integra tecnologías robustas para garantizar escalabilidad, seguridad y rendimiento. </p>

🖥️ FRONTEND – REACT

* Interfaces dinámicas y responsivas
* Componentes reutilizables
* Manejo eficiente del estado
* Comunicación con el backend mediante Fetch API

⚙️ BACKEND – FASTAPI (PYTHON) 

* Procesamiento lógico del sistema
* Validación de datos con Pydantic
* Documentación automática con Swagger UI
* Integración con SQLAlchemy para interacción con la base de datos

🗄️ BASE DE DATOS – POSTGRESQL

* Modelo relacional robusto
* Soporte para grandes volúmenes de datos
* Uso de UUID para mayor seguridad

🔐 SEGURIDAD – BCRYPT + JWT

* Encriptación de contraseñas
* Autenticación mediante tokens seguros
* Control de acceso basado en roles (RBAC)

⚙️ INSTALACIÓN Y EJECUCIÓN

🔧 Backend
* cd backend
* pip install -r requirements.txt
* uvicorn main:app --reload

🎨 Frontend
* cd frontend
* npm install
* npm start
 
🌐 Acceso

* Frontend: http://localhost:3000
* API (Swagger): http://localhost:8000/docs

☁️ DESPLIEGUE
<p align="justify"> El sistema es totalmente compatible con servicios de despliegue como Render, Railway, Vercel, AWS y Docker. Su arquitectura modular facilita actualizaciones, mantenimiento y escalabilidad. </p>

🧾 CONCLUSIONES TÉCNICAS
<p align="justify"> Gestión 360 integra en una sola plataforma los procesos académicos y administrativos fundamentales de una institución educativa. Su arquitectura moderna, sus mecanismos de seguridad y su diseño centrado en la experiencia del usuario hacen que sea una solución eficiente, escalable y adaptable a las necesidades reales del entorno educativo. </p>

❤️ AGRADECIMIENTOS
* Leidy Alexandra Cendales Perilla
* Jennifer Andrea Fajardo Bolívar
* Ingrid Carolina Velasco Gómez

👨‍💻 AUTOR
* Jhon Fredy Hidalgo Arango




