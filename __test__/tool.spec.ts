import * as tool from "../src/tool";

test("get_positive_mode", () => {
  expect(tool.get_positive_mode(12, 10)).toBe(2);
  expect(tool.get_positive_mode(-12, 10)).toBe(8);
});

test("get_template_string", () => {
  let s = "My name is {0}, my age is {2}.";
  let p1 = ["fy", undefined, "16"];
  let p2 = ["fy", "16"];
  expect(tool.get_template_string(s, ...p1)).toBe("My name is fy, my age is 16.");
  expect(tool.get_template_string(s, ...p2)).toBe("My name is fy, my age is {2}.");
});
