/**
 * @interface IPaymentGateway
 * Métodos esperados por cualquier pasarela.
 */
class IPaymentGateway {
  async authorize(/* pago */) { throw new Error("Not implemented"); }
  async capture(/* pago */)   { throw new Error("Not implemented"); }
  async refund(/* pago */)    { throw new Error("Not implemented"); }
}
module.exports = IPaymentGateway;
