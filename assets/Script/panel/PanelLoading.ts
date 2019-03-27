import { MPanel, MPanelImplements } from "../framework/MPanel";
import { MAction } from "../framework/MAction";

const { ccclass, property } = cc._decorator
const C = {
    FADE_TIME: 2,
}
/**
 * [Panel] PanelLoading
 */
@ccclass
export class PanelLoading extends cc.Component implements MPanelImplements {

    static path = 'PanelLoading'

    static async open() {
        await MPanel.open(PanelLoading)
    }

    static async close() {
        await MPanel.close(PanelLoading)
    }

    async on_open() {
        MAction.clock(this.wait_icon, 45, 0.2, cc.macro.REPEAT_FOREVER)
    }

    async on_close() {
        await MPanel.out_fade_move(this.node, "right_up", null, { time: C.FADE_TIME })
    }

    @property(cc.Node)
    wait_icon: cc.Node = null
}