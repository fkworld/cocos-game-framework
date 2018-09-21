import MPanel from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [panel] Test
 */
@ccclass
class PanelTest extends cc.Component {

    open() {
        MPanel.open_with_scale_rotate(this.node, 1)
    }

    close() {
        MPanel.close_with_scale_rotate(this.node, 1)
    }

    start() {
        MPanel.panel_open('PanelWait')
        this.scheduleOnce(() => {
            MPanel.panel_close('PanelWait')
        }, 3)
        this.scheduleOnce(() => {
            MPanel.panel_close('PanelTest')
        }, 6)
    }
}