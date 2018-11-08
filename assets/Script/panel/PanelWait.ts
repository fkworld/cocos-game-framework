import MPanel from "../framework/MPanel";

const { ccclass } = cc._decorator

/**
 * [framework-Panel] Wait
 */
@ccclass
export default class PanelWait extends cc.Component {

    open() {
        MPanel.open_with_fade(this.node)
    }

    close() {
        MPanel.close_with_fade(this.node)
    }

}