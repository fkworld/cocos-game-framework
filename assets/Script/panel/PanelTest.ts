import { MPanel, MPanelImplements } from "../framework/MPanel";
import { MSound } from "../framework/MSound";

const { ccclass, property } = cc._decorator

/**
 * [Panel] PanelTest
 */
@ccclass
export class PanelTest extends cc.Component implements MPanelImplements {

    static async open() { await MPanel.open(PanelTest.name) }
    static async close() { await MPanel.close(PanelTest.name) }
    async on_open() {
        MSound.play(MSound.SOUND.test_bgm)
    }
    async on_close() { }
}