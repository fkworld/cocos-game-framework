import { SimpleFSM } from "../src/tool-fsm";

type State = "A" | "B" | "C";
const states: { [key in State]: State[] } = { A: ["B"], B: ["C"], C: ["A"] };

test("is_state", () => {
  let s = new SimpleFSM("A", states);
  expect(s.is_state("A")).toBe(true);
  expect(s.is_state("B")).toBe(false);
});

test("is_state_with_lock", () => {
  let s = new SimpleFSM("A", states);
  s.lock();
  expect(s.is_state_with_lock("A")).toBe(false);
  expect(s.is_state_with_lock("B")).toBe(false);
  s.unlock();
  expect(s.is_state_with_lock("A")).toBe(true);
  expect(s.is_state_with_lock("B")).toBe(false);
});

test("can_go_state", () => {
  let s = new SimpleFSM("A", states);
  expect(s.can_go_state("B")).toBe(true);
  expect(s.can_go_state("C")).toBe(false);
});

test("can_go_state_with_lock", () => {
  let s = new SimpleFSM("A", states);
  s.lock();
  expect(s.can_go_state_with_lock("B")).toBe(false);
  expect(s.can_go_state_with_lock("C")).toBe(false);
  s.unlock();
  expect(s.can_go_state_with_lock("B")).toBe(true);
  expect(s.can_go_state_with_lock("C")).toBe(false);
});

test("try_go_state", () => {
  let s = new SimpleFSM("A", states);
  expect(s.try_go_state("B")).toBe(true);
  expect(s.is_state("B")).toBe(true);
  expect(s.try_go_state("A")).toBe(false);
  expect(s.is_state("B")).toBe(true);
});

test("try_go_state_with_lock", () => {
  let s = new SimpleFSM("A", states);
  s.lock();
  expect(s.try_go_state_with_lock("B")).toBe(false);
  expect(s.is_state("A")).toBe(true);
  s.unlock();
  expect(s.try_go_state_with_lock("B")).toBe(true);
  expect(s.is_state("B")).toBe(true);
});
