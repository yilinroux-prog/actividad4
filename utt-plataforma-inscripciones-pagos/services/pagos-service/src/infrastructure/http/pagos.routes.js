const express = require("express");
const PaymentDAO = require("../dao/PaymentDAO");
const EventPublisher = require("../events/EventPublisher");
const NotificationsListener = require("../events/NotificationsListener");
const CreatePago = require("../../application/CreatePago");
const ListPagos = require("../../application/ListPagos");
const GetReceipt = require("../../application/GetReceipt");

const router = express.Router();

// Dependencias (in-memory para la demo/tests)
const dao = new PaymentDAO();
const eventPublisher = new EventPublisher([ new NotificationsListener() ]);

// POST /api/pagos/create
router.post("/create", async (req, res) => {
  try {
    const { concepto, monto, bankId, matricula } = req.body || {};
    // En tu entorno real, la matrícula vendrá del JWT. Aquí aceptamos body para simplificar demo/test.
    if (!matricula || !concepto || typeof monto !== "number") {
      return res.status(400).json({ error: "Faltan campos (matricula, concepto, monto)" });
    }
    const useCase = new CreatePago({ dao, eventPublisher });
    const pago = await useCase.execute({ matricula, concepto, monto, bankId });
    return res.status(201).json(pago);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/pagos/list?matricula=xxxx
router.get("/list", async (req, res) => {
  const { matricula } = req.query;
  if (!matricula) return res.status(400).json({ error: "matricula requerida" });
  const useCase = new ListPagos({ dao });
  const pagos = await useCase.execute({ matricula });
  return res.json(pagos);
});

// GET /api/pagos/receipt/:id
router.get("/receipt/:id", async (req, res) => {
  try {
    const useCase = new GetReceipt({ dao });
    const buffer = await useCase.execute({ id: req.params.id });
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=recibo-${req.params.id}.txt`);
    return res.send(buffer);
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

module.exports = router;
