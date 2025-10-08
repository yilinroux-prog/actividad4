const CreatePago = require("../../src/application/CreatePago");
const PaymentDAO = require("../../src/infrastructure/dao/PaymentDAO");

// Mockeamos la factory para controlar respuestas del gateway
jest.mock("../../src/infrastructure/factory/PaymentGatewayFactory", () => ({
  create: jest.fn()
}));
const PaymentGatewayFactory = require("../../src/infrastructure/factory/PaymentGatewayFactory");

describe("CreatePago - ramas de error", () => {
  test("falla si authorize devuelve ok:false", async () => {
    const dao = new PaymentDAO();
    const publisher = { publish: jest.fn() };
    PaymentGatewayFactory.create.mockReturnValue({
      authorize: async () => ({ ok: false }),
      capture: async () => ({ ok: true })
    });

    const useCase = new CreatePago({ dao, eventPublisher: publisher });
    await expect(useCase.execute({
      matricula: "X", concepto: "Test", monto: 1, bankId: "BBVA"
    })).rejects.toThrow(/No autorizado/i);
  });

  test("falla si capture devuelve ok:false", async () => {
    const dao = new PaymentDAO();
    const publisher = { publish: jest.fn() };
    PaymentGatewayFactory.create.mockReturnValue({
      authorize: async () => ({ ok: true }),
      capture: async () => ({ ok: false })
    });

    const useCase = new CreatePago({ dao, eventPublisher: publisher });
    await expect(useCase.execute({
      matricula: "X", concepto: "Test", monto: 1, bankId: "BBVA"
    })).rejects.toThrow(/No capturado/i);
  });
});
