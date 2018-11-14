import MPanel from "../framework/MPanel";
import SWait from "../system/SWait";
import TErase from "../framework/tools/TErase";
import G from "../framework/G";

const { ccclass, property } = cc._decorator

/**
 * [framework-Panel] Test
 */
@ccclass
class PanelTest extends cc.Component {

    open() {
        MPanel.open_with_scale(this.node, 1)
    }

    close() {
        MPanel.close_with_scale_rotate(this.node, 1)
    }

    @property(cc.Node)
    test_mask: cc.Node = null

    start() {
        return 
        for (let i = 0; i < 10; i++) {
            let n = new cc.Node('test')
            n.setParent(this.node)
            n.position = cc.v2(-300, 50 * i)
            n.runAction(cc.moveTo(10, 300, -50 * i))
            G.run_by_each_frame(() => {
                TErase.get(this.test_mask).draw_circle(n.position)
            }, this, 10000)
        }

    }
}