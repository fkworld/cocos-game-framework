import * as ccc from "../src/tool-ccc";

describe(ccc.get_filename.name, () => {
  test("", () => {
    expect(ccc.get_filename("a.png")).toBe("a");
    expect(ccc.get_filename("path/a.png")).toBe("a");
    expect(ccc.get_filename("path/a")).toBe("a");
    expect(ccc.get_filename("db://path/a.png")).toBe("a");
  });
});

describe(ccc.to_editor_url.name, () => {
  test("", () => {
    expect(ccc.to_editor_url("a.png")).toBe("db://assets/resources/a.png");
  });
});

describe(ccc.get_node_childs.name, () => {
  let n = new cc.Node();
  let c1 = new cc.Node("c1");
  let c2 = new cc.Node("c2");
  let c2c3 = new cc.Node("c2c3");
  c2c3.addComponent(cc.Label);
  n.addChild(c1);
  n.addChild(c2);
  c2.addChild(c2c3);
  test("success", () => {
    let chidls = ccc.get_node_childs(
      n,
      { c1: cc.Node, c2: cc.Node, c2c3: cc.Label },
      { c2c3: "c2/c2c3" },
    );
    expect(chidls.self).toEqual(n);
    expect(chidls.c1).toEqual(c1);
    expect(chidls.c2).toEqual(c2);
    expect(chidls.c2c3.node).toEqual(c2c3);
    expect(chidls.c2c3).toBeInstanceOf(cc.Label);
  });
});
