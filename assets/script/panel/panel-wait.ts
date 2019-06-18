import { FMAnima } from "../framework/fm-anima";
import { FMPanelExtends, FMPanelConfig } from "../framework/fm-panel";

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
@FMPanelConfig("PanelWait")
export class PanelWait extends FMPanelExtends {

    async on_open() {
        FMAnima.clock(this.wait_icon, C.ANGLE, C.TIME, cc.macro.REPEAT_FOREVER)
    }

    @property(cc.Node)
    private wait_icon: cc.Node = null

}