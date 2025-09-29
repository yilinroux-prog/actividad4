# ADR-001 – Arquitectura del prototipo

**Decisión:** Microservicios con Gateway Nginx, Node.js/Express y PostgreSQL separados por dominio (Inscripciones y Pagos).

**Contexto:** En el análisis y modelado (C4) se definió separar los dominios *Inscripciones* y *Pagos*, con autenticación basada en matrícula (JWT) y notificaciones a correo institucional. Se prevé despliegue en Kubernetes a futuro con observabilidad. Este prototipo valida que los componentes y contratos **funcionan** end‑to‑end.

**Estado:** Aceptada (prototipo funcional).

**Consecuencias:** 
- Aísla responsabilidades y facilita escalamiento independiente (picos en periodo de inscripciones/pagos).
- Requiere un *gateway* para consolidar el acceso desde el frontend.
- Bases de datos independientes reducen acoplamiento, pero implican orquestar transacciones inter‑servicio por eventos (aquí se simula).

**Notas de implementación:** 
- `auth-service` emite JWT por matrícula (sin password en demo). En producción: SSO Microsoft 365.
- `inscripciones-service` maneja cupos en transacción SQL.
- `pagos-service` simula pasarela, persiste transacciones y **genera PDF** de recibo.
- `notifications-service` representa el servicio de correos institucionales.
- Frontend mínimo (HTML/JS) servído por el gateway.

**Diferencias vs. documento original:** El documento sugería API Gateway/proxy (se usa **Nginx**), microservicios de **Inscripciones** y **Pagos**, **Notificaciones** separadas y **bases de datos** independientes, todo lo cual se refleja en este prototipo. El despliegue se realiza con *Docker Compose* (en vez de Kubernetes) para reducir complejidad en laboratorio; el paso a K8s queda preparado por contenedores independientes.
