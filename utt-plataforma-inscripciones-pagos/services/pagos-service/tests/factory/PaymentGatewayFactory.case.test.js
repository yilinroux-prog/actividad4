const PaymentGatewayFactory = require("../../src/infrastructure/factory/PaymentGatewayFactory");
const BBVAAdapter = require("../../src/infrastructure/adapters/BBVAAdapter");

describe("PaymentGatewayFactory - case insensitive", () => {
  test("bbva en minúsculas devuelve BBVAAdapter", () => {
    const gw = PaymentGatewayFactory.create("bbva");
    expect(gw).toBeInstanceOf(BBVAAdapter);
  });
});
