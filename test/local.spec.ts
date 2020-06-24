import { get_local, set_local, _init_local } from "../src/local";

beforeEach(() => {
  _init_local({ a: "aaa" }, true);
});

describe(get_local.name, () => {
  test("", () => {
    expect(get_local("a")).toBe("aaa");
    expect(get_local("b")).toBeUndefined();
  });
  test("default value", () => {
    expect(get_local("b", "bbb")).toBe("bbb");
  });
});

describe(set_local.name, () => {
  test("", () => {
    set_local("a", "aaaa");
    expect(get_local("a")).toBe("aaaa");
  });
});
