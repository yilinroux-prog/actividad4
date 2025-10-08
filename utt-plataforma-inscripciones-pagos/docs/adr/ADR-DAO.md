 ADR – Data Access Object (DAO) en pagos-service

Contexto
Cada microservicio gestiona su propia base de datos (en este caso, `pagos-db` con PostgreSQL).  
Era necesario separar la lógica de acceso a datos de la lógica de aplicación.

 Decisión
Se creó la clase `PaymentDAO` como implementación del patrón **DAO**.  
Encapsula todas las operaciones de persistencia (`create`, `findById`, `listByMatricula`, `updateStatus`), usando una base en memoria para pruebas y PostgreSQL en despliegue real.

Consecuencias
Separa la capa de acceso a datos de la capa de negocio.  
Facilita las pruebas unitarias (puede usarse un mock o una DB in-memory).  
Requiere más código, pero mejora la mantenibilidad y el desacoplamiento.
