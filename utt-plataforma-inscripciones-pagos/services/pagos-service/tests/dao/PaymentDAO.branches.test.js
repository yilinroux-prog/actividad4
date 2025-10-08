const PaymentDAO = require("../../src/infrastructure/dao/PaymentDAO");

describe("PaymentDAO - ramas extra", () => {
  test("listByMatricula filtra correctamente", async () => {
    const dao = new PaymentDAO();
    await dao.create({ matricula: "A", concepto: "X", monto: 1 });
    await dao.create({ matricula: "B", concepto: "Y", monto: 2 });
    const listA = await dao.listByMatricula("A");
    expect(listA).toHaveLength(1);
    expect(listA[0].matricula).toBe("A");
  });

  test("findById devuelve null si no existe", async () => {
    const dao = new PaymentDAO();
    const res = await dao.findById(99999);
    expect(res).toBeNull();
  });
});
