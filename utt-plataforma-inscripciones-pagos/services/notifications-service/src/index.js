const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3003;

app.post('/api/notificaciones/email', (req, res) => {
  const { to, subject, text } = req.body || {};
  console.log('--- Notificación simulada ---');
  console.log('To:', to || 'desconocido');
  console.log('Subject:', subject || '(sin asunto)');
  console.log('Body:', text || '(sin contenido)');
  console.log('-----------------------------');
  res.json({ delivered: true });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Notifications service listening on ${PORT}`);
});
