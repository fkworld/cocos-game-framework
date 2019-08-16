import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
@FPanel.config_panel("PanelGame")
export class PanelGame extends FPanel.FPanelTemplate {

}
