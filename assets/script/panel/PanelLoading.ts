import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator
const C = {

}

/**
 * [Panel] PanelLoading
 */
@ccclass
@menu("panel/PanelLoading")
export class PanelLoading extends cc.Component implements FPanel.FPanelTemplate {

    CONFIG = {
        path: "PanelLoading",
        is_multiple: false,
        type_open: null as {},
        type_close: null as {},
    }


    async on_open() {
        FPanel.set_ui_state_data(this.node, { opacity: 255 }, { opacity: 0 })
        await FPanel.in_ui(this.node, { time: 1 })
    }

    async on_close() {
        await FPanel.out_ui(this.node, { time: 1 })
    }
}
