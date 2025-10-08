class Pago {
  constructor({ id, matricula, concepto, monto, status = "CREATED", bankId = "BBVA", fecha = new Date() }) {
    this.id = id;
    this.matricula = matricula;
    this.concepto = concepto;
    this.monto = monto;
    this.status = status; // CREATED | CONFIRMED | FAILED
    this.bankId = bankId;
    this.fecha = fecha;
  }
}
module.exports = Pago;
