class PaymentConfirmed {
  constructor({ pagoId, matricula, concepto, monto, fecha = new Date() }) {
    this.type = "PaymentConfirmed";
    this.pagoId = pagoId;
    this.matricula = matricula;
    this.concepto = concepto;
    this.monto = monto;
    this.fecha = fecha;
  }
}
module.exports = PaymentConfirmed;
