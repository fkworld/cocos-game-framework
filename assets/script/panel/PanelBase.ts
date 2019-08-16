import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator
const C = {

}

/** 界面打开关闭参数 */
interface Params {
    Open: {}
    Close: {}
}

/**
 * [Panel] PanelBase
 * - [建议] 直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口.
 * - [注意] 需要通过装饰器fm_panel_config配置界面参数.
 * - [注意] 需要通过on_open/on_close的参数类型配置FPanel.open()的参数类型.
 */
@ccclass
@menu("panel/PanelBase")
@FPanel.config_panel("PanelBase")
export class PanelBase extends FPanel.FPanelTemplate {

    async on_open(params: Params["Open"]) {

    }

    async on_close(params: Params["Close"]) {

    }
}
