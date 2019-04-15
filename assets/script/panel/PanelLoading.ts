import { MPanel, MPanelExtends } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator
const C = {
    FADE_TIME: 1,
}
/**
 * [Panel] PanelLoading
 */
@ccclass
@menu("panel/PanelLoading")
export class PanelLoading extends MPanelExtends {

    async on_open() {
        for (let i = 0; i < this.page_list.length; i += 1) {
            await MPanel.in_fade(this.page_list[i], { time: C.FADE_TIME })
            await MPanel.out_fade_move(this.page_list[i], 'up', null, { time: C.FADE_TIME })
        }
    }

    async on_close() {

    }

    onLoad() {
        for (let i = 0; i < this.page_list.length; i += 1) {
            this.page_list[i].active = false
        }
    }

    @property(cc.Node)
    page_list: cc.Node[] = []
}