import { MPanel, MPanelImplements } from "../framework/MPanel";
import { MSound } from "../framework/MSound";

const { ccclass, property } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
export class PanelTest extends cc.Component implements MPanelImplements {

    static path = 'PanelTest'

    static async open() {
        await MPanel.open(PanelTest)
    }

    static async close() {
        await MPanel.close(PanelTest)
    }

    async on_open() {
        MSound.play(MSound.SOUND.test_bgm)
    }

    async on_close() { }
}