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
        this.label_game_info.string = FText.get(
            "panel_loading_game_info",
            FVersion.get_name(),
            FVersion.get_creator(),
            FVersion.get_version_number(),
            FVersion.get_version_time(),
        )
        await FAnima.in_fade_move(this.node, { direction: "down", time: C.FADE_TIME })
    }

    async on_close() {
        await FAnima.out_fade_move(this.node, { direction: "up", time: C.FADE_TIME })
    }

    @property(cc.Label)
    private label_game_info: cc.Label = null
}
