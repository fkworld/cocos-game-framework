import MPanel from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [panel] Test
 */
@ccclass
class PanelTest extends cc.Component {
    open() {
        MPanel.open_with_nothing(this.node)
    }

    start() {
        MPanel.ins.panel_open('PanelWait')
    }
}