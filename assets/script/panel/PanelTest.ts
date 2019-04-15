import { MPanel, MPanelExtends } from "../framework/MPanel";
import { PanelMessage } from "./PanelMessage";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
@menu("panel/PanelTest")
export class PanelTest extends MPanelExtends {

    async on_open() {
        for (let i = 0; i < 5; i += 1) {
            await MPanel.open(PanelMessage, { item: "NoMercy" })
        }

    }

    async on_close() { }
}