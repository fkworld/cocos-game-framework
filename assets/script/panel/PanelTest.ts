import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
@menu("panel/PanelTest")
export class PanelTest extends cc.Component implements FPanel.FPanelTemplate {

    static context = FPanel.set_panel_context({
        path: "PanelTest",
        type_open: null as {},
        type_close: null as {},
        ins: null as PanelTest,
    })

    async on_open() { }

    async on_close() { }

}
