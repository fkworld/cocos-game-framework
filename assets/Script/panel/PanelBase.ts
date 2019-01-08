import { MPanel, IPanel } from "../framework/MPanel";
import { MSound } from "../framework/MSound";

const { ccclass, property } = cc._decorator

/**
 * [Panel] PanelBase
 */
@ccclass
export class PanelBase extends cc.Component implements IPanel {

    open() {
        MPanel.in_fade(this.node)
    }

    async close() {
        await MPanel.out_fade(this.node)
    }

    click_test() {
        MSound.play(MSound.SOUND.test_effect)
    }
}