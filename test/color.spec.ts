import { get_color, set_node_color, _init_color } from "../src/color";

beforeEach(() => {
  _init_color({ a: "000000" });
});

describe(get_color.name, () => {
  test("", () => {
    expect(get_color("a").toHEX("#rrggbb")).toBe("000000");
  });
  test("不存在此颜色", () => {
    expect(get_color("b")).toEqual(cc.Color.WHITE);
  });
});

describe(set_node_color.name, () => {
  test("", () => {
    let n = new cc.Node();
    set_node_color(n, "a");
    expect(n.color.toHEX("#rrggbb")).toBe("000000");
  });
});
