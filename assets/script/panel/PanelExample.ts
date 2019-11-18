import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator
const C = {

}

/**
 * [Panel] PanelExample
 * - [建议] 直接通过复制 PanelExample.prefab/PanelExample.ts两个文件来新建窗口,复制完毕后注意修改相应的名称.
 * - [注意] 通过on_open/on_close方法配置界面打开/关闭的处理逻辑(一般是动画).其中on_open会在onLoad之后执行.
 */
@ccclass
@menu("panel/PanelExample")
export class PanelExample extends cc.Component implements FPanel.FPanelTemplate {

    static context = FPanel.set_panel_context({
        path: "PanelExample",
        type_open: null as {},
        type_close: null as {},
        ins: null as PanelExample,
    })

    async on_open(params) {
    }

    async on_close(params) {

    }
}
