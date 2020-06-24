import { has_version, _add_version, _del_version, _init_version } from "../src/version";

beforeEach(() => {
  _init_version({ reset_local: 1, a: 0, b: 1 });
});

describe(has_version.name, () => {
  test("", () => {
    expect(has_version("a")).toBe(false);
    expect(has_version("b")).toBe(true);
  });
});

describe(_add_version.name, () => {
  test("", () => {
    _add_version("c");
    expect(has_version("c")).toBe(true);
  });
});

describe(_del_version.name, () => {
  test("", () => {
    expect(has_version("c")).toBe(false);
    _add_version("c");
    expect(has_version("c")).toBe(true);
    _del_version("c");
    expect(has_version("c")).toBe(false);
  });
});
