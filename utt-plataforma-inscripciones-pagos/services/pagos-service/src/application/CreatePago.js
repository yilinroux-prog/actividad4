const Pago = require("../domain/Pago");
const PaymentGatewayFactory = require("../infrastructure/factory/PaymentGatewayFactory");
const PaymentConfirmed = require("../domain/events/PaymentConfirmed");

class CreatePago {
  constructor({ dao, eventPublisher }) {
    this.dao = dao;
    this.eventPublisher = eventPublisher;
  }

  /**
   * Crea y confirma un pago (flujo feliz) simulando authorize+capture.
   */
  async execute({ matricula, concepto, monto, bankId = "BBVA" }) {
    const pago = new Pago({ matricula, concepto, monto, bankId });
    const saved = await this.dao.create(pago);

    const gateway = PaymentGatewayFactory.create(bankId);
    const auth = await gateway.authorize(saved);
    if (!auth.ok) throw new Error("No autorizado");

    const cap = await gateway.capture(saved);
    if (!cap.ok) throw new Error("No capturado");

    const updated = await this.dao.updateStatus(saved.id, "CONFIRMED");

    // Observer: emitir evento
    const evt = new PaymentConfirmed({
      pagoId: updated.id,
      matricula: updated.matricula,
      concepto: updated.concepto,
      monto: updated.monto,
      fecha: updated.fecha,
    });
    this.eventPublisher.publish(evt);

    return updated;
  }
}
module.exports = CreatePago;
