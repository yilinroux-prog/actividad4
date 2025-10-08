/**
 * Publicador de eventos (Observer). Para la Fase 2 usamos in-process.
 * Si más adelante quieres HTTP/Kafka/Redis, cambiamos esta clase.
 */
class EventPublisher {
  constructor(listeners = []) {
    this.listeners = listeners;
  }
  publish(event) {
    this.listeners.forEach(l => {
      try { l.handle(event); } catch (e) { /* no-op en demo */ }
    });
  }
}
module.exports = EventPublisher;
