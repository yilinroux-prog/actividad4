const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'alumnos',
  port: parseInt(process.env.PGPORT || '5432', 10)
});

function auth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'token inválido' });
  }
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/inscripciones/materias', auth, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nombre, cupo_total, cupo_disponible FROM materias ORDER BY id ASC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'error al listar materias' });
  }
});

app.post('/api/inscripciones/inscripciones', auth, async (req, res) => {
  const { materiaId } = req.body || {};
  if (!materiaId) return res.status(400).json({ error: 'materiaId requerido' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const m = await client.query('SELECT id, cupo_disponible FROM materias WHERE id=$1 FOR UPDATE', [materiaId]);
    if (m.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'materia no encontrada' });
    }
    if (m.rows[0].cupo_disponible <= 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'sin cupo disponible' });
    }
    const id = uuid();
    await client.query(
      'INSERT INTO inscripciones (id, matricula, materia_id) VALUES ($1,$2,$3)',
      [id, req.user.sub, materiaId]
    );
    await client.query(
      'UPDATE materias SET cupo_disponible = cupo_disponible - 1 WHERE id=$1',
      [materiaId]
    );
    await client.query('COMMIT');
    res.status(201).json({ id, matricula: req.user.sub, materiaId });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'error al inscribir' });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Inscripciones service listening on ${PORT}`);
});
