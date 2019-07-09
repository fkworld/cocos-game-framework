import { FPanelExtends, fm_panel_config } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
@fm_panel_config("PanelGame", "single")
export class PanelGame extends FPanelExtends {

}