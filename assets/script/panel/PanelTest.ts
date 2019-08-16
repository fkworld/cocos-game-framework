import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
@menu("panel/PanelTest")
@FPanel.config_panel("PanelTest")
export class PanelTest extends FPanel.FPanelTemplate {

}
