import MPanel from "../framework/MPanel";
import SWait from "../system/SWait";

const { ccclass, property } = cc._decorator

/**
 * [framework-Panel] Test
 */
@ccclass
class PanelTest extends cc.Component {

    open() {
        MPanel.open_with_scale_rotate(this.node, 1)
    }

    close() {
        MPanel.close_with_scale_rotate(this.node, 1)
    }

    start() {
        // SWait.panel_open()
    }
}