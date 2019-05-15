import { MPanel, MPanelExtends, MPanelConfig } from "../framework/MPanel";
const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
@menu("panel/PanelTest")
@MPanelConfig({ PATH: "PanelTest" })
export class PanelTest extends MPanelExtends {

}