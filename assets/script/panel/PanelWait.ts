import { FAnima } from "../framework/FAnima";
import { fm_panel_config, FPanelExtends } from "../framework/FPanel";

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
@fm_panel_config("PanelWait")
export class PanelWait extends FPanelExtends {

    async on_open() {
        FAnima.clock(this.wait_icon, C.ANGLE, C.TIME, cc.macro.REPEAT_FOREVER)
    }

    @property(cc.Node)
    private wait_icon: cc.Node = null

}