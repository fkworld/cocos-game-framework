import { FAnima } from "../framework/FAnima";
import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelWait
 */
@ccclass
@menu("panel/PanelWait")
export class PanelWait extends cc.Component implements FPanel.FPanelTemplate {

    static context = FPanel.set_panel_context({
        path: "PanelWait",
        type_open: null as {},
        type_close: null as {},
    })

    async on_open() {
        FAnima.clock(this.wait_icon, 45, 0.1)
    }

    async on_close() { }

    @property(cc.Node)
    private wait_icon: cc.Node = null

}
