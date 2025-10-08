const BBVAAdapter = require("../adapters/BBVAAdapter");

class PaymentGatewayFactory {
  static create(bankId = "BBVA") {
    switch ((bankId || "").toUpperCase()) {
      case "BBVA": return new BBVAAdapter();
      default:
        throw new Error(`Banco no soportado: ${bankId}`);
    }
  }
}
module.exports = PaymentGatewayFactory;
