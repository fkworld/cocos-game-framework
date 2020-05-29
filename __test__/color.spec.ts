import * as color from "../src/color";

const CONFIG = {
  none: "FFFFFF",
  a: "000000",
  b: "111111",
};

color._init_color_runtime(CONFIG);

test("get_color", () => {
  expect(color.get_color("a").toString()).toBe("rgba(0, 0, 0, 255)");
  expect(color.get_color("b").toString()).toBe("rgba(17, 17, 17, 255)");
});
