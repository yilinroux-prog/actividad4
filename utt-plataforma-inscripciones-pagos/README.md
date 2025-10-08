# Plataforma UTT – Prototipo funcional (Microservicios)

**Objetivo:** probar con código la arquitectura de microservicios planteada (Inscripciones y Pagos, con autenticación por matrícula y notificaciones), usando **API Gateway (Nginx)**, **Node.js/Express**, **PostgreSQL** y un **frontend mínimo** (HTML/JS).

## Topología (contenedores)

- `api-gateway` (Nginx): sirve el frontend y enruta `/api/*` a cada microservicio.
- `auth-service`: emite JWT a partir de la matrícula (y correo institucional si se proporciona).
- `inscripciones-service`: lista materias y registra inscripciones (DB: `alumnos-db`).
- `pagos-service`: registra pagos, “procesa” y genera recibo PDF (DB: `pagos-db`). Publica evento hacia `notifications-service`.
- `notifications-service`: stub que simula envío de correo institucional (imprime en consola).
- `alumnos-db`: PostgreSQL con tablas `materias` e `inscripciones` (datos de ejemplo).
- `pagos-db`: PostgreSQL con tabla `pagos`.

> **Arquitectura base:** microservicios separados con bases de datos independientes, API Gateway y flujos de inscripción/pago y notificación, tal como se propuso en el documento de arquitectura (C4/containers y decisiones) — ver  en la carpeta de `/docs`. 

## Requisitos

- Docker y Docker Compose (v2+).
- Puertos libres: `8080` (Gateway), `5433` y `5434` (Postgres expuesto opcionalmente).

## Puesta en marcha

```bash
docker compose up --build
```

Cuando todos los contenedores estén `healthy/listening`, abre:  
**http://localhost:8080**

## Endpoints principales (pasando por el gateway)

- Autenticación:
  - `POST http://localhost:8080/api/auth/login` → `{ matricula, email? }` → `{ token }`
  - `GET  http://localhost:8080/api/auth/me` (con `Authorization: Bearer <token>`)

- Inscripciones:
  - `GET  http://localhost:8080/api/inscripciones/materias`
  - `POST http://localhost:8080/api/inscripciones/inscripciones` → `{ materiaId }` (usa matrícula del JWT)

- Pagos:
  - `POST http://localhost:8080/api/pagos/create` → `{ concepto, monto }`
  - `GET  http://localhost:8080/api/pagos/list`
  - `GET  http://localhost:8080/api/pagos/receipt/<id>` → descarga PDF

> **Nota:** el frontend (página simple) ya consume estos endpoints a través del Gateway.

## Credenciales de ejemplo

No hay contraseña en este prototipo: escribe cualquier **matrícula** (por ejemplo `20231234`) y, si no proporcionas correo, el sistema asumirá `<matricula>@uttehuacan.edu.mx`.

## Estructura del repo

```
.
├── docker-compose.yml
├── gateway/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── html/ (frontend)
├── services/
│   ├── auth-service/
│   ├── inscripciones-service/
│   ├── pagos-service/
│   └── notifications-service/
├── db/
│   ├── alumnos/init.sql
│   └── pagos/init.sql
└── docs/
    ├── ADR-001-arquitectura.md
    └── C4-resumen.md
```

## Pruebas manuales rápidas (sin frontend)

1) **Login**
```bash
curl -X POST http://localhost:8080/api/auth/login   -H "Content-Type: application/json"   -d '{"matricula":"20231234"}'
```

2) **Listar materias**
```bash
TOKEN=<token_devuelto>
curl http://localhost:8080/api/inscripciones/materias   -H "Authorization: Bearer $TOKEN"
```

3) **Inscribirse en una materia**
```bash
curl -X POST http://localhost:8080/api/inscripciones/inscripciones   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"materiaId":1}'
```

4) **Registrar un pago y obtener recibo**
```bash
curl -X POST http://localhost:8080/api/pagos/create   -H "Authorization: Bearer $TOKEN"   -H "Content-Type: application/json"   -d '{"concepto":"Reinscripción","monto":750.00}'

# Listar
curl http://localhost:8080/api/pagos/list -H "Authorization: Bearer $TOKEN"
# Descargar recibo (usa id que te devolvió el POST)
curl -L http://localhost:8080/api/pagos/receipt/<id> -o recibo.pdf
```

## Notas de seguridad

- **JWT**: firmado por `JWT_SECRET` (solo propósitos de demo). No hay contraseñas; en producción integraría SSO (Microsoft 365) y reglas de emisión.
- **Pagos**: la “pasarela” está simulada y **no** procesa tarjetas (no es PCI-DSS).
- **Datos**: sin PII sensible; tablas de ejemplo y recibos de prueba.


Parte 2 – Actividad 5: Implementación de Patrones y CI/CD
Objetivo

Extender el prototipo de la Plataforma UTT aplicando cuatro patrones de diseño en el microservicio pagos-service, e integrar un pipeline CI/CD en GitHub Actions con pruebas automatizadas y documentación.


Patrones aplicados (en pagos-service)

| Tipo               | Patrón                       | Descripción                                                                                           |
| ------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Creacional**     | **Factory Method**           | Permite crear adaptadores según el banco (`BBVA`, `Banamex`, etc.) sin modificar la lógica principal. |
| **Estructural**    | **Adapter**                  | Convierte las solicitudes internas al formato esperado por cada API bancaria simulada.                |
| **Comportamiento** | **Observer**                 | Notifica automáticamente al `notifications-service` cuando un pago es confirmado.                     |
| **Emergente**      | **DAO (Data Access Object)** | Gestiona la persistencia en PostgreSQL (`PaymentDAO`) separando acceso a datos y lógica de negocio.   |

Cada patrón se implementó en su carpeta respectiva dentro de src/infrastructure/:
services/pagos-service/src/infrastructure/
├── adapters/        # Adapter + Factory Method
├── dao/             # DAO
├── events/          # Observer (Publisher/Listener)
└── factory/         # Factory Method

Cobertura de Pruebas

Se crearon tests unitarios para validar los patrones.

Cobertura alcanzada: > 85% (branches > 70%) 

Comando de ejecución:

cd services/pagos-service
npm run test:coverage
 Evidencia:

docs/evidence/coverage-summary.png (reporte de cobertura)

docs/evidence/ci-success.png (pipeline en verde)

CI/CD en GitHub Actions

Se configuró el pipeline en .github/workflows/ci.yml con los siguientes pasos:

Checkout del repo

Setup Node.js (v20)

Instalación de dependencias

Lint

Tests + cobertura

Build y generación de docs

Upload de artefactos (coverage y docs)

 Evidencia:
El workflow “pagos-service CI” corre automáticamente en cada push o pull request.

UML y ADR Documentados

Ubicación: /docs/

docs/uml/pagos-service-clases.png → Diagrama de clases (Factory, Adapter, DAO, Observer).

docs/uml/pagos-service-secuencia.png → Flujo: CreatePago → Factory/Adapter → DAO → EventPublisher/Listener.

docs/adr/ADR-Factory-Adapter.md

docs/adr/ADR-Observer.md

docs/adr/ADR-DAO.md

 Swagger y Documentación API

Archivo: docs/swagger.json (OpenAPI 3.0)
Contiene los endpoints de pagos-service:

POST /api/pagos/create

GET /api/pagos/list

GET /api/pagos/receipt/:id

 Evidencias entregadas
docs/
├── adr/
│   ├── ADR-Factory-Adapter.md
│   ├── ADR-Observer.md
│   └── ADR-DAO.md
├── uml/
│   ├── pagos-service-clases.png
│   └── pagos-service-secuencia.png
├── swagger.json
└── evidence/
    ├── ci-success.png
    └── coverage-summary.png

Conclusión

Esta segunda parte valida que:

Los patrones de diseño están implementados correctamente.

El servicio de pagos es modular, mantenible y extensible.

El pipeline CI/CD automatiza la verificación de calidad del código.

Se documenta la arquitectura con UML, ADR y Swagger.