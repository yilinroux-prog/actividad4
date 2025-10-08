const PaymentDAO = require("../../src/infrastructure/dao/PaymentDAO");

describe("PaymentDAO - ramas", () => {
  test("updateStatus devuelve null si no existe el id", async () => {
    const dao = new PaymentDAO();
    const res = await dao.updateStatus(9999, "CONFIRMED");
    expect(res).toBeNull();
  });
});
