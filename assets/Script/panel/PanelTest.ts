import MPanel from "../framework/MPanel";
import SWait from "../system/SWait";
import TErase from "../framework/tools/TErase";
import G from "../framework/G";

const { ccclass, property } = cc._decorator

/**
 * [framework-Panel] Test
 */
@ccclass
class PanelTest extends cc.Component {

    open() {
        MPanel.in_scale(this.node, 1)
    }

    close() {
        MPanel.out_scale(this.node, 1)
    }
}