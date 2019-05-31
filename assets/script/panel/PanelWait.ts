import { MAction } from "../framework/MAction";
import { MPanelExtends, MPanelConfig } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator
const C = {
    ANGLE: 45,
    TIME: 0.1,
}

/**
 * [Panel] PanelWait + system
 */
@ccclass
@menu("panel/PanelWait")
@MPanelConfig("PanelWait")
export class PanelWait extends MPanelExtends {

    async on_open() {
        MAction.clock(this.wait_icon, C.ANGLE, C.TIME, cc.macro.REPEAT_FOREVER)
    }

    @property(cc.Node)
    wait_icon: cc.Node = null

}