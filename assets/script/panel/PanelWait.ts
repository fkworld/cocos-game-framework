import { MAction } from "../framework/MAction";
import { MPanelExtends } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] Wait+system,逻辑与UI合并
 */
@ccclass
@menu("panel/PanelWait")
export class PanelWait extends MPanelExtends {

    static PATH = "PanelWait"

    async on_open() {
        MAction.clock(this.wait_icon, 45, 0.1, cc.macro.REPEAT_FOREVER)
    }

    @property(cc.Node)
    wait_icon: cc.Node = null

}