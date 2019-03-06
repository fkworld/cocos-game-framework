import { MPanel, MPanelImplements } from "../framework/MPanel";
import { MAction } from "../framework/MAction";

const { ccclass, property } = cc._decorator

/**
 * [Panel] Wait+system，逻辑与UI合并
 */
@ccclass
export class PanelWait extends cc.Component implements MPanelImplements {

    static async open() { await MPanel.open(PanelWait.name) }

    static async close() { await MPanel.close(PanelWait.name) }

    async on_open() {
        MAction.clock(this.wait_icon, 45, 0.1, cc.macro.REPEAT_FOREVER)
    }

    async on_close() {

    }

    @property(cc.Node)
    wait_icon: cc.Node = null

}