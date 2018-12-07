import { MPanel } from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [framework-Panel] Test
 */
@ccclass
class PanelTest extends cc.Component {

    open(param1, param2) {
        MPanel.in_fade(this.node)
    }

    async close(param1, param2) {
        await MPanel.out_fade(this.node)
    }

    @property(cc.Sprite)
    sp: cc.Sprite = null

    start() {

    }
}