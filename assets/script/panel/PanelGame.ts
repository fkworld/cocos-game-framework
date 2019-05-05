import { MPanel, MPanelExtends } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
export class PanelGame extends MPanelExtends {

    static PATH = "PanelGame";

}