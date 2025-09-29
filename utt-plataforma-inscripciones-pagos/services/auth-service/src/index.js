const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN || 'uttehuacan.edu.mx';

app.post('/api/auth/login', (req, res) => {
  const { matricula, email } = req.body || {};
  if (!matricula) {
    return res.status(400).json({ error: 'matricula requerida' });
  }
  const inferredEmail = email || `${matricula}@${ALLOWED_DOMAIN}`;
  const token = jwt.sign(
    { sub: matricula, email: inferredEmail, role: 'alumno' },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, user: { matricula, email: inferredEmail } });
});

app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: payload });
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Auth service listening on ${PORT}`);
});
