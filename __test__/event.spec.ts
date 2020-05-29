import * as event from "../src/event";

test("event_center", () => {
  expect(event.event_center).toBeInstanceOf(cc.EventTarget);
});
