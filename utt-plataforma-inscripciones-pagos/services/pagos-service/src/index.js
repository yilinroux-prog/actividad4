// services/pagos-service/src/index.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

// Rutas modulares de pagos (donde está la lógica/DAO/Observer/Factory/Adapter)
const pagosRoutes = require("./infrastructure/http/pagos.routes");

// ---- Config básica de app ----
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---- Config de puerto y JWT ----
const PORT = process.env.PORT || 3002; // conservamos 3002 como en tu servicio
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// ---- Middleware de autenticación (reusa tu lógica actual) ----
function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub: <matricula>, email?: ... }
    next();
  } catch (e) {
    return res.status(401).json({ error: "token inválido" });
  }
}

// ---- Healthcheck ----
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---- Monta rutas de pagos bajo /api/pagos, protegidas con JWT ----
app.use("/api/pagos", auth, pagosRoutes);

// ---- Arranque del servidor (y export para tests) ----
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[pagos-service] listening on ${PORT}`);
  });
}

module.exports = app;
