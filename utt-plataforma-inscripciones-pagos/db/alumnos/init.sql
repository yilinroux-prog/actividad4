-- DB alumnos
CREATE TABLE IF NOT EXISTS materias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  cupo_total INT NOT NULL DEFAULT 30,
  cupo_disponible INT NOT NULL DEFAULT 30
);

CREATE TABLE IF NOT EXISTS inscripciones (
  id UUID PRIMARY KEY,
  matricula VARCHAR(20) NOT NULL,
  materia_id INT NOT NULL REFERENCES materias(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Datos de ejemplo
INSERT INTO materias (nombre, cupo_total, cupo_disponible)
VALUES
  ('Arquitectura de Software', 2, 2),
  ('Programación I', 3, 3),
  ('Matemáticas I', 5, 5)
ON CONFLICT DO NOTHING;
