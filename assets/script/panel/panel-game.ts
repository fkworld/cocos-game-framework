import { FMPanel, FMPanelExtends, fm_panel_config } from "../framework/fm-panel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
@fm_panel_config("PanelGame", "single")
export class PanelGame extends FMPanelExtends {

}