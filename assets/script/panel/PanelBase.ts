import { MPanel, MPanelExtends } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator
/** 界面参数 */
interface PanelParams {
    /** 打开参数 */
    OpenParams: {}
    /** 关闭参数 */
    CloseParams: {}
}
const C = {

}

/**
 * [Panel] PanelBase
 * - 建议直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口.
 * - 如果config省略,或者config没有配置完全,则为默认值;如果on_open()和on_close()省略,则为空函数.
 * - 配置config时,属性需要强制类型转换.
 */
@ccclass
@menu("panel/PanelBase")
export class PanelBase extends MPanelExtends {

    static PATH = "PanelBase"
    static TYPE = <"single">"single"
    static OPEN_PARAMS: PanelParams["OpenParams"]
    static CLOSE_PARAMS: PanelParams["CloseParams"]

    async on_open(params: typeof PanelBase.OPEN_PARAMS) {

    }

    async on_close(params: typeof PanelBase.CLOSE_PARAMS) {

    }
}