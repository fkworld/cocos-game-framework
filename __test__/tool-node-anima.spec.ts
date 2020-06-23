import {
  set_node_anima,
  get_node_anima_now,
  node_anima_not,
  node_anima,
} from "../src/tool-node-anima";

let node = new cc.Node();

beforeEach(() => {
  set_node_anima(node, { show: { scale: 1 }, hide: { scale: 0 } }, { now: "hide" });
});

describe(set_node_anima.name, () => {
  // TODO
});

describe.skip(get_node_anima_now.name, () => {
  test("", () => {
    expect(get_node_anima_now(node)).toBe("hide");
  });
});

describe(node_anima_not.name, () => {
  // TODO
});

describe(node_anima.name, () => {
  // TODO
});
