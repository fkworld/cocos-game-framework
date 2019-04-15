import { MPanel, MPanelExtends } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator
const C = {

}
interface OpenParams { }
interface CloseParams { }

/**
 * [Panel] PanelBase
 * - 建议直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口.
 * - 如果config省略,或者config没有配置完全,则为默认值;如果on_open()和on_close()省略,则为空函数.
 * - 配置config时,属性需要强制类型转换.
 */
@ccclass
@menu("panel/PanelBase")
export class PanelBase extends MPanelExtends {

    static config = {
        open_type: <"false">"false",
        open_params: <OpenParams>{},
        close_params: <CloseParams>{},
    }

    async on_open(params: OpenParams) {

    }

    async on_close(params: CloseParams) {

    }
}