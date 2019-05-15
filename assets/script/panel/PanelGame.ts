import { MPanel, MPanelExtends, MPanelConfig } from "../framework/MPanel";
const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
@MPanelConfig({ PATH: "PanelGame" })
export class PanelGame extends MPanelExtends {

}