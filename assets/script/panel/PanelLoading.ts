import { FAnima } from "../framework/FAnima";
import { FPanel } from "../framework/FPanel";
import { FText } from "../framework/FText";
import { FVersion } from "../framework/FVersion";

const { ccclass, property, menu } = cc._decorator
const C = {
    FADE_TIME: 1,
}

/**
 * [Panel] PanelLoading
 */
@ccclass
@menu("panel/PanelLoading")
@FPanel.config_panel("PanelLoading")
export class PanelLoading extends FPanel.FPanelTemplate {

    async on_open() {
        FPanel.set_ui_state_data(this.node, { opacity: 255 }, { opacity: 0 })
        await FPanel.in_ui(this.node, { time: 1 })
    }

    async on_close() {
        await FPanel.out_ui(this.node, { time: 1 })
    }
}
