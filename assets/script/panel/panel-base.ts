import { FMPanel, FMPanelExtends, fm_panel_config } from "../framework/fm-panel";

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
 * - [注意] 需要通过on_open/on_close的参数类型配置FMPanel.open()的参数类型.
 */
@ccclass
@menu("panel/PanelBase")
@fm_panel_config("PanelBase", "single")
export class PanelBase extends FMPanelExtends {

    async on_open(params: Params["Open"]) {

    }

    async on_close(params: Params["Close"]) {

    }
}