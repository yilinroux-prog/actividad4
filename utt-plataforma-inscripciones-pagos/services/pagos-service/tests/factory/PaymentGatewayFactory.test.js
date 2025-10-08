const PaymentGatewayFactory = require("../../src/infrastructure/factory/PaymentGatewayFactory");
const BBVAAdapter = require("../../src/infrastructure/adapters/BBVAAdapter");

describe("PaymentGatewayFactory", () => {
  test("devuelve BBVAAdapter por defecto", () => {
    const gw = PaymentGatewayFactory.create();
    expect(gw).toBeInstanceOf(BBVAAdapter);
  });

  test("lanza error si banco no soportado", () => {
    expect(() => PaymentGatewayFactory.create("FOO")).toThrow(/no soportado/i);
  });
});
