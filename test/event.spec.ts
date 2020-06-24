import { event_center } from "../src/event";

describe("event_center", () => {
  test("", () => {
    expect(event_center).toBeInstanceOf(cc.EventTarget);
  });
});
