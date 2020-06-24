import {
  adjust_canvas,
  do_schedule,
  do_widget,
  get_filename,
  get_node_childs,
  get_node_wp,
  load_async,
  load_res_async,
  load_res_dir_async,
  set_node_by_wp,
  to_editor_url,
} from "../src/tool-ccc";

describe(adjust_canvas.name, () => {
  test.todo("");
});

describe(do_widget.name, () => {
  test.todo("");
});

describe(do_schedule.name, () => {
  test.todo("");
});

describe(get_node_wp.name, () => {
  test("", () => {
    let node = new cc.Node();
    expect(get_node_wp(node)).toEqual(cc.Vec3.ZERO);
  });
});

describe(set_node_by_wp.name, () => {
  let parent = new cc.Node();
  let child = new cc.Node();
  parent.addChild(child);

  beforeEach(() => {
    child.position = cc.Vec3.ZERO;
  });

  test("flag=false", () => {
    expect(set_node_by_wp(child, cc.v3(100, 100))).toMatchObject({ x: 100, y: 100 });
    expect(child.position).toMatchObject({ x: 0, y: 0, z: 0 });
  });
  test("flag=true", () => {
    set_node_by_wp(child, cc.v3(100, 100), true);
    expect(child.position).toMatchObject({ x: 100, y: 100 });
  });
});

describe(load_async.name, () => {
  test.todo("");
});

describe(load_res_async.name, () => {
  test.todo("");
});

describe(load_res_dir_async.name, () => {
  test.todo("");
});

describe(get_filename.name, () => {
  test("", () => {
    expect(get_filename("a.png")).toBe("a");
    expect(get_filename("path/a.png")).toBe("a");
    expect(get_filename("path/a")).toBe("a");
    expect(get_filename("db://path/a.png")).toBe("a");
  });
});

describe(to_editor_url.name, () => {
  test("", () => {
    expect(to_editor_url("a.png")).toBe("db://assets/resources/a.png");
  });
});

describe(get_node_childs.name, () => {
  let n = new cc.Node();
  let c1 = new cc.Node("c1");
  let c2 = new cc.Node("c2");
  let c2c3 = new cc.Node("c2c3");
  c2c3.addComponent(cc.Label);
  n.addChild(c1);
  n.addChild(c2);
  c2.addChild(c2c3);
  test("success", () => {
    let chidls = get_node_childs(
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
