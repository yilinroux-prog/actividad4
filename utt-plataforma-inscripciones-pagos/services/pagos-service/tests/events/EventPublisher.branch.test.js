const EventPublisher = require("../../src/infrastructure/events/EventPublisher");

describe("EventPublisher - listener con error (rama catch)", () => {
  test("no revienta si un listener lanza", () => {
    const badListener = { handle: () => { throw new Error("boom"); } };
    const goodListener = { handle: jest.fn() };
    const pub = new EventPublisher([badListener, goodListener]);

    expect(() => pub.publish({ type: "X" })).not.toThrow();
    expect(goodListener.handle).toHaveBeenCalledTimes(1);
  });
});
