import * as version from "../src/version";

test("模块初始化", () => {
  version._init_version({ resetLocal: 1, a: 0, b: 1 }, {});
  expect(version.version_center.get_keys()).toEqual(["resetLocal", "b"]);
});
