const IPaymentGateway = require("../../src/infrastructure/adapters/IPaymentGateway");

describe("IPaymentGateway - métodos abstractos", () => {
  test("lanzan error por defecto", async () => {
    const gw = new IPaymentGateway();
    await expect(gw.authorize({})).rejects.toThrow(/Not implemented/);
    await expect(gw.capture({})).rejects.toThrow(/Not implemented/);
    await expect(gw.refund({})).rejects.toThrow(/Not implemented/);
  });
});
