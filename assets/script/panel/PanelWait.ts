import { FAnima } from "../framework/FAnima";
import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelWait + system
 */
@ccclass
@menu("panel/PanelWait")
@FPanel.config_panel("PanelWait")
export class PanelWait extends FPanel.FPanelTemplate {

    async on_open() {
        FAnima.clock(this.wait_icon, 45, 0.1, cc.macro.REPEAT_FOREVER)
    }

    @property(cc.Node)
    private wait_icon: cc.Node = null

}
