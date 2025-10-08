Actividad 5: Investigación y Aplicación de Patrones de Diseño + CI/CD
1. Patrones de Diseño GoF

 Creacionales – Factory Method

Se utiliza cuando una clase necesita delegar la creación de objetos a sus subclases, permitiendo instanciar diferentes tipos sin conocer sus detalles concretos.

Ventajas: Facilita la extensión del sistema y reduce el acoplamiento.

Desventajas: Puede generar muchas clases adicionales.

Ejemplo en la arquitectura SaaS: El microservicio de Pagos puede emplear un Factory Method para instanciar distintos adaptadores de pasarela bancaria (Banorte, Santander, sandbox) sin cambiar la lógica de negocio.

Estructurales – Adapter

Permite conectar componentes con interfaces incompatibles adaptando una clase a otra.

Ventajas: Reutiliza código existente y facilita la integración con sistemas externos.

Desventajas: Aumenta la complejidad si hay muchos adaptadores.

Ejemplo en la arquitectura: El componente BancoAdapter traduce las peticiones del sistema UTT al formato que acepta el banco convenio, haciendo que el microservicio de pagos no dependa directamente de la API del banco.

De comportamiento – Observer

Define una relación uno-a-muchos entre objetos para que, cuando uno cambie de estado, los demás sean notificados automáticamente.

Ventajas: Desacopla módulos y permite reacciones automáticas a eventos.

Desventajas: Puede generar llamadas en cascada difíciles de rastrear.

Ejemplo en la arquitectura: Cuando se confirma un pago, el EventPublisher del microservicio de Pagos notifica a los servicios de Notificaciones y Reportes, que reaccionan sin depender directamente del servicio emisor.

2. Patrones Emergentes

MVC (Model-View-Controller): Divide la aplicación en modelo, vista y controlador. En el Portal del Alumno, mejora la organización de la interfaz React o Angular.

DAO (Data Access Object): Aísla la lógica de acceso a datos. En la arquitectura SaaS, InscripcionRepository y PaymentRepository funcionan como DAOs.

CQRS (Command Query Responsibility Segregation): Separa lecturas y escrituras para optimizar rendimiento.

DDD (Domain-Driven Design): Define dominios claros en microservicios independientes (Inscripciones, Pagos, Notificaciones, Reportes).

3. Anti-patrones

God Object: Clase o servicio con demasiadas responsabilidades. Se evita al dividir la aplicación en microservicios pequeños y específicos.

Spaghetti Code: Código sin estructura clara. Se previene mediante controladores (InscripcionController, PagoController) y repositorios bien definidos.

4. CI/CD (Integración y Entrega Continua)
Concepto

CI (Continuous Integration): Automatiza la integración y prueba del código en cada commit.

CD (Continuous Delivery): Prepara versiones listas para desplegar.

CD (Continuous Deployment): Despliega automáticamente a producción.

 Herramientas comunes

GitHub Actions, GitLab CI, Jenkins, CircleCI.
En tu arquitectura basada en Kubernetes, GitHub Actions puede compilar, ejecutar pruebas y desplegar Pods automáticamente.

 Ejemplo de pipeline
name: SaaS CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Instalar dependencias
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Ejecutar pruebas
        run: npm test -- --coverage

      - name: Construir imagen Docker
        run: docker build -t saas-utt/payments .

      - name: Desplegar en Kubernetes
        uses: azure/k8s-deploy@v5
        with:
          manifests: |
            k8s/deployment.yaml
            k8s/service.yaml


Beneficios: Automatiza pruebas, asegura calidad continua, reduce errores humanos y acelera entregas.

5. Selección personal de patrones para implementar

Patrón Creacional – Factory Method:
Se aplicará en el microservicio de Pagos para crear adaptadores según el banco seleccionado. Esto permitirá soportar nuevas pasarelas sin alterar la lógica principal.

Patrón Estructural – Adapter:
Se implementará para conectar el sistema con diferentes APIs bancarias. El adaptador convertirá las peticiones internas al formato requerido por cada banco.

Patrón de Comportamiento – Observer:
Se utilizará en el flujo de eventos: cuando se confirme un pago, se notificará automáticamente a los microservicios de Notificaciones y Reportes.

Patrón Emergente – DAO (Data Access Object):
Cada microservicio tendrá su propio DAO para gestionar la persistencia de datos (por ejemplo, PaymentDAO y InscriptionDAO), lo que mejora la separación de capas y la mantenibilidad.

6. Conclusión

Aplicar patrones de diseño en conjunto con prácticas CI/CD fortalece la arquitectura SaaS basada en microservicios.
Los patrones seleccionados —Factory Method, Adapter, Observer y DAO— favorecen la escalabilidad, el desacoplamiento y la claridad del sistema, mientras que CI/CD garantiza integraciones seguras y despliegues automáticos en la nube.