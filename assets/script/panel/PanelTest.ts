import { MPanel, MPanelImplements } from "../framework/MPanel";
import { PanelMessage } from "./PanelMessage";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
@menu("panel/PanelTest")
export class PanelTest extends cc.Component implements MPanelImplements {

    static path = 'PanelTest'

    static async open() {
        await MPanel.open(PanelTest)
    }

    static async close() {
        await MPanel.close(PanelTest)
    }

    async on_open() {
        PanelMessage.open("JavaScript")
    }

    async on_close() { }
}