import * as local from "../src/local";
import * as version from "../src/version";

jest.spyOn(cc.sys.localStorage.__proto__, "clear").mockReturnValue(undefined);
jest.spyOn(cc.sys.localStorage.__proto__, "getItem").mockReturnValue(undefined);
jest.spyOn(cc.sys.localStorage.__proto__, "setItem").mockReturnValue(undefined);

version._init_version_runtime({ resetLocal: 1 }, {});
local._init_local_runtime({
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
