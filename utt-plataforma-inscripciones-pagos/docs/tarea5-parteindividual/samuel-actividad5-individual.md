Actividad 5: Investigación y Aplicación de Patrones de Diseño + CI/CD
1. Patrones de Diseño GoF
 Creacionales

Patrón Singleton
Se utiliza cuando se necesita una única instancia de una clase que gestione un recurso compartido, como una conexión a base de datos o un manejador de configuración.
Ventajas: Control centralizado del recurso, evita duplicados.
Desventajas: Puede acoplar en exceso si se abusa.
Ejemplo en la arquitectura: El servicio de autenticación JWT/OAuth2 podría usar un Singleton para administrar las claves de cifrado y emisión de tokens.

Estructurales

Patrón Facade
Simplifica el acceso a subsistemas complejos mediante una interfaz unificada.
Ventajas: Reduce la complejidad y el acoplamiento.
Desventajas: Si se sobreutiliza, puede ocultar errores internos.
Ejemplo: El API Gateway en la arquitectura SaaS actúa como un facade, ya que centraliza todas las peticiones y coordina los microservicios (inscripciones, pagos, notificaciones).

 De comportamiento

Patrón Observer
Permite que múltiples componentes reaccionen a un evento sin depender directamente entre sí.
Ventajas: Desacopla emisores y receptores.
Desventajas: Puede ser difícil de depurar si hay muchos observadores.
Ejemplo: El EventPublisher del microservicio de pagos notifica automáticamente a Notificaciones y Reportes cuando se completa un pago

Arquitectura saas (2)



2. Patrones Emergentes
 MVC (Model-View-Controller)

Ideal para separar la lógica de negocio, la presentación y el control de flujo.
En el Portal del Alumno (frontend), MVC facilita el mantenimiento de vistas y componentes en React, separando las reglas de validación de las interfaces.

 DAO (Data Access Object)

Permite aislar la lógica de acceso a datos.
En tu arquitectura, InscripcionRepository y PaymentRepository cumplen esta función al manejar la persistencia de inscripciones y pagos

Arquitectura saas (2)

.

 CQRS (Command Query Responsibility Segregation)

Divide las operaciones de lectura y escritura.
En tu sistema, los reportes de pagos e inscripciones se podrían leer desde una base de datos optimizada para consultas, mientras las escrituras se manejan en otra instancia principal.

 DDD (Domain-Driven Design)

Cada microservicio (Inscripciones, Pagos, Notificaciones) representa un bounded context independiente.
Esto permite que cada dominio evolucione de forma separada, mejorando la mantenibilidad y escalabilidad del SaaS.

3. Anti-patrones
 God Object

Ocurre cuando una clase concentra demasiadas responsabilidades.
En tu arquitectura: Evitado gracias a los microservicios, que dividen el dominio en componentes pequeños y especializados.

 Spaghetti Code

Se da cuando el código no tiene una estructura clara.
Prevención: El uso de controladores (InscripcionController, PagoController) y repositorios bien definidos evita la mezcla desordenada de lógica.

4. CI/CD
 ¿Qué es?

CI (Integración Continua): Proceso donde los desarrolladores integran código frecuentemente, verificando mediante pruebas automáticas.

CD (Entrega Continua): Automatiza el despliegue a entornos de prueba o producción, garantizando releases confiables.

 Herramientas recomendadas

GitHub Actions: Ideal por su integración con repositorios GitHub.

GitLab CI, Jenkins, CircleCI: alternativas según la infraestructura.
En tu arquitectura Kubernetes, un pipeline en GitHub Actions puede compilar, ejecutar pruebas y desplegar Pods automáticamente.

 Ejemplo de pipeline YAML
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install

      - name: Lint code
        run: npm run lint

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Build application
        run: npm run build

      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/deployment.yaml
            k8s/service.yaml
Beneficios

Automatiza integraciones y despliegues.

Asegura calidad mediante pruebas automáticas.

Reduce errores humanos en producción.

Acelera entregas continuas de nuevas funciones.

5. Selección personal de patrones para implementar
Tipo	Patrón elegido	Aplicación en el sistema
Creacional	Singleton	Gestión del servicio de autenticación JWT y claves de cifrado.
Estructural	Facade	API Gateway como punto de entrada central a los microservicios.
Comportamiento	Observer	EventPublisher notifica a Notificaciones y Reportes.
Emergente	DAO	Repositorios (InscripcionRepository, PaymentRepository) para separar lógica de datos.