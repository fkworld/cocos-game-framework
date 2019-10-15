import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
export class PanelGame extends cc.Component implements FPanel.FPanelTemplate {

    CONFIG = {
        path: "PanelGame",
        is_multiple: false,
        type_open: null as {},
        type_close: null as {},
    }

    async on_open() { }
    async on_close() { }

}
