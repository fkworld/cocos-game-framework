import MPanel from "../framework/MPanel";
import PanelWait from "./PanelWait";
import PanelMessage from "./PanelMessage";

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
        // PanelMessage.open('a test message')
        PanelWait.open()
        this.scheduleOnce(() => { PanelWait.close() }, 3)
        // let tx = this.sp.spriteFrame.getTexture()
        // cc.log(this.sp)
        // let rt = new cc.RenderTexture()
        // rt.initWithSize(2, 2);
        // (<any>rt).drawTextureAt(tx, 0, 0)

        // cc.log(rt.readPixels(null, 0, 0, 100, 100))
    }
}