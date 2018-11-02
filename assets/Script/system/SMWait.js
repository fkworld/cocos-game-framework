import MPanel from "../framework/MPanel";

const C = {

}
Object.freeze(C)

/**
 * [system] wait系统
 * - 一个通用的等待界面
 */
export default class SMWait {

    /** 打开wait界面 */
    static panel_open() {
        MPanel.panel_open('PanelWait')
    }

    /** 关闭wait界面 */
    static panel_close() {
        MPanel.panel_close('PanelWait')
    }

}