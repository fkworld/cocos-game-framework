import * as panel from "../src/panel";

@panel.DeSetPanelContext("")
class PanelTest extends panel.PanelBase {
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

jest.spyOn(cc, "instantiate").mockImplementation(() => {
  let mockedNode = new cc.Node();
  mockedNode.addComponent(PanelTest);
  return mockedNode;
});

panel._init_panel_runtime(new cc.Node());

test("open_panel", async () => {
  expect(PanelTest.ins).toBeUndefined();
  expect(PanelTest.a).toBe(0);
  await panel.open_panel(PanelTest);
  expect(PanelTest.ins.node.active).toBe(true);
  expect(PanelTest.a).toBe(2);
});

test("close_panel", async () => {
  await panel.close_panel(PanelTest);
  expect(PanelTest.ins.node.active).toBe(false);
  expect(PanelTest.a).toBe(3);
});
