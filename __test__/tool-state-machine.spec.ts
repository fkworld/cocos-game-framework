import { StateMachine } from "../src/tool-state-machine";

let state_machine = new StateMachine("A", { A: ["B"], B: ["C"], C: ["A"] });
beforeEach(() => {
  state_machine._reset("A");
});

describe(StateMachine.prototype.is_state.name, () => {
  test("", () => {
    expect(state_machine.is_state("A")).toBe(true);
    expect(state_machine.is_state("B")).toBe(false);
  });
});

describe(StateMachine.prototype.is_state_lock.name, () => {
  test("", () => {
    state_machine.lock();
    expect(state_machine.is_state_lock("A")).toBe(false);
    state_machine.unlock();
    expect(state_machine.is_state_lock("A")).toBe(true);
  });
});

describe(StateMachine.prototype.can_go_state.name, () => {
  test("", () => {
    expect(state_machine.can_go_state("B")).toBe(true);
    expect(state_machine.can_go_state("C")).toBe(false);
  });
  test("lock_state", () => {
    state_machine.lock();
    expect(state_machine.can_go_state("B", "Lock")).toBe(false);
    state_machine.unlock();
    expect(state_machine.can_go_state("B", "Lock")).toBe(true);
  });
});

describe(StateMachine.prototype.try_go_state.name, () => {
  test("", () => {
    expect(state_machine.try_go_state("B")).toBe(true);
    expect(state_machine.is_state("B")).toBe(true);
  });
  test("lock_state", () => {
    state_machine.lock();
    expect(state_machine.try_go_state("B", "Lock")).toBe(false);
    expect(state_machine.is_state("A")).toBe(true);
  });
});
