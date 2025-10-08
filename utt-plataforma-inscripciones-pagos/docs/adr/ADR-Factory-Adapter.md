ADR – Factory Method + Adapter en pagos-service

Contexto
El microservicio de **Pagos** debe conectarse con diferentes pasarelas bancarias (BBVA, Santander, etc.) sin alterar la lógica del caso de uso principal `CreatePago`.  
Era necesario definir una forma flexible de crear objetos adaptadores para cada banco.

Decisión
Se implementó el **patrón Factory Method** dentro de `PaymentGatewayFactory` para crear la instancia del adaptador correcto según el banco (`BBVAAdapter`, `SantanderAdapter`, etc.).  
Cada adaptador implementa la interfaz `IPaymentGateway` aplicando el **patrón Adapter**, que traduce las llamadas internas al formato de la API del banco.

 Consecuencias
 Permite agregar nuevos bancos sin modificar la lógica de negocio.  
 Reduce el acoplamiento entre la aplicación y los detalles técnicos de cada API.  
 Aumenta el número de clases y archivos, pero mejora la mantenibilidad.  
