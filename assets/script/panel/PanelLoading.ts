import { MPanel, MPanelExtends, MPanelConfig } from "../framework/MPanel";
import { Mi18n } from "../framework/Mi18n";
import { MVersion } from "../framework/MVersion";

const { ccclass, property, menu } = cc._decorator
const C = {
    FADE_TIME: MPanel.TIME * 3,
}
/**
 * [Panel] PanelLoading
 */
@ccclass
@menu("panel/PanelLoading")
@MPanelConfig("PanelLoading")
export class PanelLoading extends MPanelExtends {

    async on_open() {
        this.label_game_info.string = Mi18n.text(
            "panel_loading_game_info",
            MVersion.NAME,
            MVersion.CREATOR,
            MVersion.VERSION_NUMBER,
            MVersion.VERSION_TIME,
        )
        await MPanel.in_fade_move(this.node, "down", null, { time: C.FADE_TIME })
    }

    async on_close() {
        await MPanel.out_fade_move(this.node, "up", null, { time: C.FADE_TIME })
    }

    @property(cc.Label)
    private label_game_info: cc.Label = null
}