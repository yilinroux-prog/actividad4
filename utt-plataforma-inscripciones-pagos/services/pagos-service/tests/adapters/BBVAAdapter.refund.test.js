const BBVAAdapter = require("../../src/infrastructure/adapters/BBVAAdapter");

describe("BBVAAdapter - refund", () => {
  test("refund ok", async () => {
    const adapter = new BBVAAdapter();
    const r = await adapter.refund({ id: 1 });
    expect(r.ok).toBe(true);
    expect(r.refundId).toMatch(/BBVA-REF/);
  });
});
