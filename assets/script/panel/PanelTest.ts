import { MPanel, MPanelExtends } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
@menu("panel/PanelTest")
export class PanelTest extends MPanelExtends {

    static PATH = "PanelTest"
}