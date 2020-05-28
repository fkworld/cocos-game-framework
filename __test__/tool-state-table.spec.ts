import { StateTable } from "../src/tool-state-table";

const t = new StateTable({ a: 1, b: 2, c: 3, d: 4 });

test("has", () => {
  expect(t.has("a")).toBe(true);
  expect(t.has("e" as any)).toBe(false);
});

test("get", () => {
  expect(t.get("a")).toBe(1);
  expect(t.get("e" as any)).toBeUndefined();
});

test("add", () => {
  expect(t.has("f" as any)).toBe(false);
  t.add("f" as any);
  expect(t.has("f" as any)).toBe(true);
});

test("del", () => {
  expect(t.has("d")).toBe(true);
  t.del("d" as any);
  expect(t.has("d")).toBe(false);
});
