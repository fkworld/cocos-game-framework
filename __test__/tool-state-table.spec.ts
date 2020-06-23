import { StateTable } from "../src/tool-state-table";

let state_table = new StateTable({ a: 1, b: 2, c: 3, d: 4 });

describe(StateTable.prototype.has.name, () => {
  test("", () => {
    expect(state_table.has("a")).toBe(true);
    expect(state_table.has("e" as any)).toBe(false);
  });
});

describe(StateTable.prototype.get.name, () => {
  test("", () => {
    expect(state_table.get("a")).toBe(1);
  });
  test("undefined", () => {
    expect(state_table.get("e" as any)).toBeUndefined();
  });
});

describe(StateTable.prototype._add.name, () => {
  test("", () => {
    expect(state_table.has("f" as any)).toBe(false);
    state_table._add("f" as any);
    expect(state_table.has("f" as any)).toBe(true);
  });
});

describe(StateTable.prototype._del.name, () => {
  test("", () => {
    expect(state_table.has("d")).toBe(true);
    state_table._del("d" as any);
    expect(state_table.has("d")).toBe(false);
  });
});
