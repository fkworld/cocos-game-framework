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

    static context = FPanel.set_panel_context({
        path: "PanelLoading",
        type_open: null as {},
        type_close: null as {},
    })


    async on_open() {
        FPanel.bind_ui_state_data(this.node, {
            "show": { opacity: 255 },
            "hide": { opacity: 0 }
        })
        FPanel.set_ui(this.node, "hide")
        await FPanel.anima_ui(this.node, { key: "show", time: 1 })
    }

    async on_close() {
        await FPanel.anima_ui(this.node, { key: "hide", time: 1 })
    }
}
