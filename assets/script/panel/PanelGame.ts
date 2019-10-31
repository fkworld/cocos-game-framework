import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
export class PanelGame extends cc.Component implements FPanel.FPanelTemplate {

    static context = FPanel.set_panel_context({
        path: "PanelGame",
        type_open: null as {},
        type_close: null as {},
        ins: null as PanelGame,
    })

    async on_open() { }

    async on_close() { }

}
