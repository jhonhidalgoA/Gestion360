-- Tabla: asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
  subject_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  area VARCHAR(100),
  hours_per_week INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: grados
CREATE TABLE IF NOT EXISTS grados (
  grade_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL UNIQUE
);

-- Tabla: docentes
CREATE TABLE IF NOT EXISTS docentes (
  teacher_id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL
);

-- Tabla: horarios
CREATE TABLE IF NOT EXISTS horarios (
  schedule_id SERIAL PRIMARY KEY,
  grade_id INTEGER NOT NULL,
  teacher_id INTEGER NOT NULL,
  day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_id INTEGER NOT NULL,
  FOREIGN KEY (grade_id) REFERENCES grados(grade_id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES docentes(teacher_id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES asignaturas(subject_id) ON DELETE CASCADE
);

-- Datos iniciales: asignaturas
INSERT INTO asignaturas (name, area, hours_per_week)
VALUES
  ('Castellano', 'Lenguaje', 5),
  ('Inglés', 'Lenguaje', 4),
  ('Matemáticas', 'Matemáticas', 4),
  ('C. Sociales', 'Ciencias Sociales', 3),
  ('Historia y Geografía', 'Ciencias Sociales', 3),
  ('Artística', 'Arte', 2),
  ('Biología', 'Ciencias Naturales', 2),
  ('E. Física', 'Educación Física', 2),
  ('Tecnología', 'Tecnología', 2),
  ('C. Lectora', 'Lenguaje', 1),
  ('Cátedra de Paz', 'Ética y Valores', 1),
  ('Ética', 'Ética y Valores', 1),
  ('Estadística', 'Matemáticas', 1),
  ('Física', 'Ciencias Naturales', 1),
  ('Geometría', 'Matemáticas', 1),
  ('Química', 'Ciencias Naturales', 1),
  ('Religión', 'Religión', 1),
  ('Descanso', 'Otros', 5),
  ('Almuerzo', 'Otros', 5)
ON CONFLICT (name) DO NOTHING;

-- Datos iniciales: grados (0 a 11)
INSERT INTO grados (level, name)
VALUES
  (0, 'Preescolar'),
  (1, 'Grado Primero'),
  (2, 'Grado Segundo'),
  (3, 'Grado Tercero'),
  (4, 'Grado Cuarto'),
  (5, 'Grado Quinto'),
  (6, 'Grado Sexto'),
  (7, 'Grado Séptimo'),
  (8, 'Grado Octavo'),
  (9, 'Grado Noveno'),
  (10, 'Grado Décimo'),
  (11, 'Grado Undécimo')
ON CONFLICT (level) DO NOTHING;

-- Datos iniciales: docentes
INSERT INTO docentes (full_name)
VALUES
  ('Director 1'),
  ('Director 2')
ON CONFLICT (full_name) DO NOTHING;