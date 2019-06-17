import { FMPanel, FMPanelExtends, FMPanelConfig } from "../framework/fm-panel";
import { FMI18n } from "../framework/fm-i18n";
import { FMVersion } from "../framework/fm-version";

const { ccclass, property, menu } = cc._decorator
const C = {
    FADE_TIME: FMPanel.TIME * 3,
}
/**
 * [Panel] PanelLoading
 */
@ccclass
@menu("panel/PanelLoading")
@FMPanelConfig("PanelLoading")
export class PanelLoading extends FMPanelExtends {

    async on_open() {
        this.label_game_info.string = FMI18n.text(
            "panel_loading_game_info",
            FMVersion.NAME,
            FMVersion.CREATOR,
            FMVersion.VERSION_NUMBER,
            FMVersion.VERSION_TIME,
        )
        await FMPanel.in_fade_move(this.node, "down", null, { time: C.FADE_TIME })
    }

    async on_close() {
        await FMPanel.out_fade_move(this.node, "up", null, { time: C.FADE_TIME })
    }

    @property(cc.Label)
    private label_game_info: cc.Label = null
}