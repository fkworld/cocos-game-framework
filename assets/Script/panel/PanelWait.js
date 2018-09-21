import MPanel from "../framework/MPanel";

const { ccclass } = cc._decorator

/**
 * 【框架-Panel】 Wait
 */
@ccclass
export default class PanelWait extends cc.Component {

    open() {
        MPanel.open_with_fade(this.node)
    }

    close() {
        MPanel.close_with_fade(this.node)
    }

    /**
     * 打开PanelWait
     * @static
     */
    static open_panelwait() {
        MPanel.ins.panel_open('PanelWait')
    }

    /**
     * 关闭PanelWait
     * @static
     */
    static close_panelwait() {
        MPanel.ins.panel_close('PanelWait')
    }
}