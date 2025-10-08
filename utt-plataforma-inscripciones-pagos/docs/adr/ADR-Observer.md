ADR – Observer en pagos-service

 Contexto
Cuando un pago se confirma, el sistema debe notificar automáticamente a otros microservicios (por ejemplo, `notifications-service`) sin bloquear el flujo principal.

 Decisión
Se aplicó el **patrón Observer** usando dos clases:
 `EventPublisher`: administra y publica eventos a los listeners registrados.
 `NotificationsListener`: escucha los eventos `PaymentConfirmed` y envía la notificación (simulada por consola en este prototipo).

 Consecuencias
 Permite agregar nuevos suscriptores (listeners) sin modificar la lógica de negocio.  
 Desacopla el procesamiento del evento de la transacción principal.  
 En producción requeriría un sistema de mensajería (Kafka, RabbitMQ o HTTP async) para asegurar la entrega.
