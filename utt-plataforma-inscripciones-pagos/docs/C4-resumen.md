# Resumen C4 del prototipo

**Contexto (personas y sistemas):**
- *Alumno UTT*: se autentica con matrícula y realiza inscripción/pago.
- *Administrativo*: (parcialmente cubierto) podría consultar reportes.
- *Pasarela de pagos externa*: simulada en este prototipo.
- *Correo institucional (Microsoft 365)*: simulado por `notifications-service`.

**Contenedores:**
- **Frontend** (HTML/JS) → usa `/api/*`.
- **API Gateway** (Nginx).
- **Auth Service** (JWT).
- **Inscripciones Service** (REST + Postgres `alumnos-db`).
- **Pagos Service** (REST + Postgres `pagos-db` + generación de recibo PDF + evento a Notificaciones).
- **Notifications Service** (REST simulado).

**Componentes internos (ejemplos):**
- Inscripciones: `InscripcionController` → `InscripcionRepository` (transacción).
- Pagos: `PagoController` → `PaymentManager` (simulado) → `ReciboGenerator (PDF)` → `EventPublisher` (HTTP) → Notifications.

**Alineación con el documento:** ver páginas con C4, containers y despliegue (Kubernetes) en el PDF original.
