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

    static PATH = "PanelLoading"

    async on_open() {
        this.page_list.forEach(v => v.active = false)
        for (let node of this.page_list) {
            await MPanel.in_fade(node, { time: C.FADE_TIME })
            await MPanel.out_fade_move(node, "up", null, { time: C.FADE_TIME })
        }
    }

    @property(cc.Node)
    private page_list: cc.Node[] = []
}