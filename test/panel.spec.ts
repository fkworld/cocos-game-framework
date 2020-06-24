import {
  close_panel,
  DE_SET_PANEL_CONTEXT,
  open_panel,
  PanelBase,
  _init_panel,
} from "../src/panel";

jest.spyOn(cc, "instantiate").mockImplementation(() => {
  let node = new cc.Node();
  node.addComponent(PanelTest);
  return node;
});

beforeAll(() => {
  _init_panel(new cc.Node());
});

@DE_SET_PANEL_CONTEXT("")
class PanelTest extends PanelBase {
  static ins: PanelTest;
  static a = 0;
  async on_create() {
    PanelTest.ins = this;
    PanelTest.a = 1;
  }
  async on_open() {
    PanelTest.a = 2;
  }
  async on_close() {
    PanelTest.a = 3;
  }
}

describe.skip(open_panel.name, () => {
  test("", async () => {
    expect(PanelTest.ins).toBeUndefined();
    expect(PanelTest.a).toBe(0);
    await open_panel(PanelTest);
    expect(PanelTest.ins.node.active).toBe(true);
    expect(PanelTest.a).toBe(2);
  });
});

describe.skip(close_panel.name, () => {
  test("", async () => {
    await close_panel(PanelTest);
    expect(PanelTest.ins.node.active).toBe(false);
    expect(PanelTest.a).toBe(3);
  });
});
