import { FMPanel, FMPanelExtends, FMPanelConfig } from "../framework/fm-panel";

const { ccclass, property, menu } = cc._decorator
const C = {

}

/** 界面打开参数接口 */
interface ParamOpen { }
/** 界面关闭参数接口 */
interface ParamClose { }

/**
 * [Panel] PanelBase
 * - [建议] 直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口.
 * - [注意] 需要通过FMPanelConfig配置界面参数.
 * - [注意] 需要通过on_open/on_close的参数类型配置FMPanel.open()的参数类型.
 */
@ccclass
@menu("panel/PanelBase")
@FMPanelConfig("PanelBase", "single")
export class PanelBase extends FMPanelExtends {

    async on_open(param: ParamOpen) {

    }

    async on_close(param: ParamClose) {

    }
}