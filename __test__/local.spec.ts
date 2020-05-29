import * as local from "../src/local";

local._init_local({
  language: "chinese",
  music: true,
  sound: true,
  a: "aaa",
  b: "bbb",
});

test("get_local", () => {
  expect(local.get_local("a")).toBe("aaa");
  expect(local.get_local("b")).toBe("bbb");
});

test("set_local", () => {
  local.set_local("a", "aaaa");
  expect(local.get_local("a")).toBe("aaaa");
});
