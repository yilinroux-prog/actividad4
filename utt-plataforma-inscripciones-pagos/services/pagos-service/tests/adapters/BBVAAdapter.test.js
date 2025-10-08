const BBVAAdapter = require("../../src/infrastructure/adapters/BBVAAdapter");

describe("BBVAAdapter (simulado)", () => {
  const adapter = new BBVAAdapter();
  const pago = { id: 1 };

  test("authorize ok", async () => {
    const r = await adapter.authorize(pago);
    expect(r.ok).toBe(true);
    expect(r.authCode).toMatch(/BBVA-AUTH/);
  });

  test("capture ok", async () => {
    const r = await adapter.capture(pago);
    expect(r.ok).toBe(true);
    expect(r.captureId).toMatch(/BBVA-CAP/);
  });
});
