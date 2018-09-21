import MPanel from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [panel] Test
 */
@ccclass
class PanelTest extends cc.Component {
    open() {
        MPanel.open_with_nothing(this.node)
    }

    start() {
        MPanel.panel_open('PanelWait')
        this.scheduleOnce(() => {
            MPanel.panel_close('PanelWait')
        }, 3)
    }
}