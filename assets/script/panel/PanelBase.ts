import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator
const C = {

}

/** 界面打开关闭参数 */
interface Params {
    open: {}
    close: {}
}

/**
 * [Panel] PanelBase
 * - [建议] 直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口.
 * - [注意] 通过装饰器FPanel.config_panel配置界面参数.
 * - [注意] 通过on_open/on_close方法配置界面打开/关闭的处理逻辑(一般是动画).其中on_open会在onLoad之后执行.
 */
@ccclass
@menu("panel/PanelBase")
@FPanel.config_panel("PanelBase")
export class PanelBase extends FPanel.FPanelTemplate {

    async on_open(params: Params["open"]) {

    }

    async on_close(params: Params["close"]) {

    }
}
