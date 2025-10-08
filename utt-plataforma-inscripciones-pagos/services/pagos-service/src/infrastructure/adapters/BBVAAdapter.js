const IPaymentGateway = require("./IPaymentGateway");

/**
 * Adapter simulado para BBVA.
 * En producción, aquí irían las llamadas HTTP reales a la API del banco.
 */
class BBVAAdapter extends IPaymentGateway {
  async authorize(pago) {
    // Simula autorización
    return { ok: true, authCode: "BBVA-AUTH-123", pagoId: pago.id };
  }
  async capture(pago) {
    // Simula captura
    return { ok: true, captureId: "BBVA-CAP-456", pagoId: pago.id };
  }
  async refund(pago) {
    // Simula reembolso
    return { ok: true, refundId: "BBVA-REF-789", pagoId: pago.id };
  }
}
module.exports = BBVAAdapter;
