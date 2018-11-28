import MPanel from "../framework/MPanel";

/**
 * [framework-S] wait系统
 * - 一个通用的等待界面
 */
export default class SWait {

    static open_panel() { MPanel.open('PanelWait') }

    static close_panel() { MPanel.close('PanelWait') }
}