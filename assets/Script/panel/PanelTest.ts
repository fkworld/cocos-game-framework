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

    open(param1, param2) {
        MPanel.in_scale(this.node, 1)
    }

    async close(param1, param2) {
        await MPanel.out_scale(this.node, 1)
    }

}