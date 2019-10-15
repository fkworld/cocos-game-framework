import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
@menu("panel/PanelTest")
export class PanelTest extends cc.Component implements FPanel.FPanelTemplate {

    CONFIG = {
        path: "PanelTest",
        is_multiple: false,
        type_open: null as {},
        type_close: null as {},
    }

    async on_open() { }

    async on_close() { }

}
