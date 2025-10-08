// Para la Fase 2, un recibo mínimo como Buffer de texto (sin PDF real)
// Si quieres PDF real, cambiamos a pdfkit (lo soporta tu pipeline igual).
class ReceiptGenerator {
  static async generate(pago) {
    const content = `RECIBO\nID: ${pago.id}\nMatricula: ${pago.matricula}\nConcepto: ${pago.concepto}\nMonto: ${pago.monto}\nStatus: ${pago.status}\n`;
    return Buffer.from(content, "utf-8");
  }
}
module.exports = ReceiptGenerator;
