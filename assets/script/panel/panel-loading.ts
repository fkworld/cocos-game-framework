import { FMI18n } from "../framework/fm-i18n";
import { FMPanel, FMPanelExtends, fm_panel_config } from "../framework/fm-panel";
import { FMVersion } from "../framework/fm-version";
import { FMPanelUI } from "../framework/f-m-panel-ui";

const { ccclass, property, menu } = cc._decorator
const C = {
    FADE_TIME: 1,
}

/**
 * [Panel] PanelLoading
 */
@ccclass
@menu("panel/PanelLoading")
@fm_panel_config("PanelLoading", "single")
export class PanelLoading extends FMPanelExtends {

    async on_open() {
        this.label_game_info.string = FMI18n.get("panel_loading_game_info",
            FMVersion.NAME,
            FMVersion.CREATOR,
            FMVersion.VERSION_NUMBER,
            FMVersion.VERSION_TIME)
        await FMPanelUI.in_fade_move(this.node, { direction: "down", time: C.FADE_TIME })
    }

    async on_close() {
        await FMPanelUI.out_fade_move(this.node, { direction: "up", time: C.FADE_TIME })
    }

    @property(cc.Label)
    private label_game_info: cc.Label = null
}