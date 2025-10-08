const ReceiptGenerator = require("../infrastructure/pdf/ReceiptGenerator");

class GetReceipt {
  constructor({ dao }) { this.dao = dao; }
  async execute({ id }) {
    const pago = await this.dao.findById(id);
    if (!pago) throw new Error("Pago no encontrado");
    return ReceiptGenerator.generate(pago);
  }
}
module.exports = GetReceipt;
