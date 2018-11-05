import MPanel from "../framework/MPanel";
import SMWait from "../system/SMWait";

const { ccclass, property } = cc._decorator

/**
 * [panel] Test
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

    }
}