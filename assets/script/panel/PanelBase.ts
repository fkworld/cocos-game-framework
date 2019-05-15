import { MPanel, MPanelExtends, MPanelConfig } from "../framework/MPanel";
const { ccclass, property, menu } = cc._decorator

/** 界面打开参数接口 */
interface OpenParams { }
/** 界面关闭参数接口 */
interface CloseParams { }
/** 界面内部配置参数 */
const C = {

}

/**
 * [Panel] PanelBase
 * - [建议] 直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口.
 * - [注意] 需要通过MPanelConfig配置界面参数.
 * - [注意] 如果有的话,需要配置OPEN_PARAMS/CLOSE_PARAMS来进行类型提示.
 */
@ccclass
@menu("panel/PanelBase")
@MPanelConfig({ PATH: "PanelBase", TYPE: "single" })
export class PanelBase extends MPanelExtends {

    static OPEN_PARAMS: OpenParams;
    static CLOSE_PARAMS: CloseParams;

    async on_open(params: OpenParams) {

    }

    async on_close(params: CloseParams) {

    }
}