/**
 * 注意，涉及到游戏生命周期的函数，则不可在node环境中测试。
 */

import * as ccc from "../src/tool-ccc";

test("get_filename", () => {
  expect(ccc.get_filename("a.png")).toBe("a");
  expect(ccc.get_filename("path/a.png")).toBe("a");
  expect(ccc.get_filename("path/a")).toBe("a");
  expect(ccc.get_filename("db://path/a.png")).toBe("a");
});

test("to_editor_url", () => {
  expect(ccc.to_editor_url("a.png")).toBe("db://assets/resources/a.png");
});
