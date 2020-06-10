import * as color from "../src/color";

beforeAll(() => {
  color._init_color({
    none: "FFFFFF",
    a: "000000",
    b: "111111",
  });
});

describe(color.get_color.name, () => {
  test("", () => {
    expect(color.get_color("a").toHEX("#rrggbb")).toBe("000000");
    expect(color.get_color("b").toHEX("#rrggbb")).toBe("111111");
  });
});

describe(color.set_node_color.name, () => {
  test("", () => {
    let n = new cc.Node();
    color.set_node_color(n, "a");
    expect(n.color.toHEX("#rrggbb")).toBe("000000");
  });
});
