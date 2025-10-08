const PaymentConfirmed = require("../../src/domain/events/PaymentConfirmed");

describe("PaymentConfirmed - constructor", () => {
  test("crea evento con datos correctos", () => {
    const evt = new PaymentConfirmed({
      pagoId: 123, matricula: "20231234", concepto: "Reinscripción", monto: 750
    });
    expect(evt.type).toBe("PaymentConfirmed");
    expect(evt.pagoId).toBe(123);
    expect(evt.matricula).toBe("20231234");
    expect(evt.concepto).toBe("Reinscripción");
    expect(evt.monto).toBe(750);
    expect(evt.fecha instanceof Date).toBe(true);
  });
});
