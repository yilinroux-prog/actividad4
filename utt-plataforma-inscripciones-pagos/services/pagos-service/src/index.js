const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const RECEIPTS_DIR = process.env.RECEIPTS_DIR || path.join(__dirname, '..', 'receipts');
const NOTIFICATIONS_URL = process.env.NOTIFICATIONS_URL || 'http://notifications-service:3003';

if (!fs.existsSync(RECEIPTS_DIR)) fs.mkdirSync(RECEIPTS_DIR, { recursive: true });

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'pagos',
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

app.post('/api/pagos/create', auth, async (req, res) => {
  const { concepto, monto } = req.body || {};
  if (!concepto || !monto) return res.status(400).json({ error: 'concepto y monto requeridos' });

  const id = uuid();
  const matricula = req.user.sub;

  try {
    await pool.query(
      'INSERT INTO pagos (id, matricula, concepto, monto, estado) VALUES ($1,$2,$3,$4,$5)',
      [id, matricula, concepto, monto, 'aprobado']  // simulación: aprobado directo
    );

    // Generar recibo PDF
    const pdfPath = path.join(RECEIPTS_DIR, `${id}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.fontSize(18).text('Universidad Tecnológica - Recibo de Pago', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Folio: ${id}`);
    doc.text(`Matrícula: ${matricula}`);
    doc.text(`Concepto: ${concepto}`);
    doc.text(`Monto: $${Number(monto).toFixed(2)}`);
    doc.text(`Estado: APROBADO`);
    doc.text(`Fecha: ${new Date().toLocaleString('es-MX')}`);
    doc.moveDown();
    doc.text('Este recibo es válido solo para propósitos de demostración.');
    doc.end();

    await new Promise(resolve => stream.on('finish', resolve));

    // Publicar evento de notificación (simulado)
    try {
      await axios.post(`${NOTIFICATIONS_URL}/api/notificaciones/email`, {
        to: req.user.email || `${matricula}@uttehuacan.edu.mx`,
        subject: 'Confirmación de pago UTT',
        text: `Se registró tu pago: ${concepto} por $${Number(monto).toFixed(2)} (folio ${id}).`
      }, { timeout: 2000 });
    } catch (e) {
      console.warn('No se pudo notificar (simulado):', e.message);
    }

    res.status(201).json({
      id,
      matricula,
      concepto,
      monto,
      estado: 'aprobado',
      receipt: `/api/pagos/receipt/${id}`
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'error al registrar pago' });
  }
});

app.get('/api/pagos/list', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, matricula, concepto, monto, estado, created_at FROM pagos WHERE matricula=$1 ORDER BY created_at DESC',
      [req.user.sub]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'error al listar pagos' });
  }
});

app.get('/api/pagos/receipt/:id', auth, async (req, res) => {
  const file = path.join(RECEIPTS_DIR, `${req.params.id}.pdf`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'recibo no encontrado' });
  res.setHeader('Content-Type', 'application/pdf');
  fs.createReadStream(file).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Pagos service listening on ${PORT}`);
});
