Actividad 5: Investigación y Aplicación de Patrones de Diseño + CI/CD
Fase 1: Investigación (individual, reporte en /docs/research.md)

1.	Patrones de diseño GoF
Creacionales
Se enfocan en cómo crear objetos de forma flexible. 
Ventaja: reduce el acoplamiento.
Desventaja: puede hacer el código más complejo.
Ejemplo: en aplicaciones web, se usa para crear conexiones a diferentes bases de datos.

Estructurales
Se usan para organizar clases y objetos.
Ventaja: facilita la reutilización de código.
Desventaja: puede generar muchas clases extra.
Ejemplo: usar un adaptador para que una API externa funcione con nuestro sistema.

De comportamiento
Se enfocan en cómo los objetos se comunican.
Ventaja: los objetos están menos acoplados.
Desventaja: difícil de depurar cuando hay muchos observadores.
Ejemplo: en apps móviles, cuando un usuario recibe notificaciones de cambios en tiempo real.

2.	Patrones emergentes
MVC: conviene usarlo cuando haces aplicaciones web o de escritorio con interfaces gráficas (como sitios con formularios o dashboards)
DAO: conviene usarlo cuando trabajas con bases de datos grandes o sistemas donde podría cambiar el tipo de base de datos.
CQRS: conviene usarlo en sistemas grandes donde se hacen muchas lecturas y pocas escrituras (o viceversa).
 DDD: conviene usarlo en proyectos complejos donde es importante que el software refleje bien las reglas del negocio.
MVVM: conviene usarlo para aplicaciones móviles o de escritorio modernas 

3.	Anti-patrones
God Object: 
Un objeto que concentra demasiada lógica y responsabilidades y difícil de mantener y entender.
Evitarlo: aplicar el principio de responsabilidad única.
Spaghetti Code:
Código desordenado, sin estructura clara y difícil de leer y modificar.
Evitarlo: aplicar el principio de responsabilidad única.

4.	CI/CD (Continuous Integration / Continuous Delivery/Deployment)
¿Qué es CI/CD?
 CI : integrar y probar código frecuentemente.
CD (Continuous Delivery): el código está listo para ser desplegado en cualquier momento.
CD (Continuous Deployment): cada cambio aprobado se despliega automáticamente.

Herramientas más usadas
GitHub Actions: Se integra directamente con GitHub.
GitLab CI/CD: Funciona dentro de GitLab, muy usado por empresas.
Jenkins: Una de las herramientas más antiguas y potentes, aunque requiere más configuración.
CircleCI: Muy fácil de usar, popular en proyectos pequeños y medianos.

Ejemplos de pipelines típicos en proyectos reales.
Descargar el código del repositorio 
Ejecutar pruebas para comprobar que el código no tiene errores.
Construir la aplicación 
Desplegar automáticamente el resultado en un servidor o servicio en la nube.

Beneficios en equipos de desarrollo profesional.
•	Entregas más rápidas y constantes.
•	Menos errores 
•	Mejor trabajo en equipo (cada quien puede subir su parte sin romper el proyecto).
•	Se detectan errores antes de llegar al usuario.
•	Aumenta la confianza para lanzar nuevas versiones.


Un ejemplo de YAML de pipeline sencillo (no importa si no lo entienden todo, pero deben explicarlo).

name: CI Pipeline
on:
  push:
    branches: [ "main" ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Descargar código
        uses: actions/checkout@v3
      - name: Instalar dependencias
        run: npm install
      - name: Ejecutar pruebas
        run: npm test
        
5.	Selección personal de 4 patrones

Creacional: lo usaría para manejar conexiones a diferentes bases de datos.
Estructural: lo usaría para integrar APIs externas al sistema.
De comportamiento: lo usaría para implementar notificaciones en tiempo real.
Emergente:  lo usaría como base del sistema web en las semanas 3–4.
