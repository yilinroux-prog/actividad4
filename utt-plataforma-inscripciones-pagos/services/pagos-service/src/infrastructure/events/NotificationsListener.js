// Listener stub: simula envío de correo institucional
class NotificationsListener {
  handle(event) {
    if (event?.type === "PaymentConfirmed") {
      // En la demo: imprime en consola
      // En prod: llamarías al notifications-service por HTTP
      // (lo dejamos así para cumplir Observer sin agregar acoplamiento)
      // eslint-disable-next-line no-console
      console.log(`[notifications] Email enviado a ${event.matricula}@uttehuacan.edu.mx por pago ${event.pagoId}`);
    }
  }
}
module.exports = NotificationsListener;
