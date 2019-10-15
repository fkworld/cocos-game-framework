import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator
const C = {

}

/**
 * [Panel] PanelBase
 * - [建议] 直接通过复制PanelBase.prefab/PanelBase.ts两个文件来新建窗口,复制完毕后注意修改相应的名称.
 * - [注意] 通过on_open/on_close方法配置界面打开/关闭的处理逻辑(一般是动画).其中on_open会在onLoad之后执行.
 */
@ccclass
@menu("panel/PanelBase")
export class PanelBase extends cc.Component implements FPanel.FPanelTemplate {

    CONFIG = {
        path: "PanelBase",
        is_multiple: false,
        type_open: null as {},
        type_close: null as {},
    }

    async on_open(params: typeof PanelBase.prototype.CONFIG.type_open) {

    }

    async on_close(params: typeof PanelBase.prototype.CONFIG.type_close) {

    }
}
