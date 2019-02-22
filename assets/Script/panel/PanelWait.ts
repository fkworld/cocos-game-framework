import { MPanel, MPanelImplements } from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [Panel] Wait+system，逻辑与UI合并
 */
@ccclass
export class PanelWait extends cc.Component implements MPanelImplements {

    static async open() { await MPanel.open(PanelWait.name) }
    static async close() { await MPanel.close(PanelWait.name) }
    async on_open() {
        for (let n of this.array_ui_item) {
            MPanel.in_scale(n)
        }
        this.set_anima()
    }
    async on_close() {
        let anima = []
        for (let n of this.array_ui_item) {
            anima.push(MPanel.out_scale(n))
        }
        await Promise.all(anima)
    }

    @property(cc.Node)
    array_ui_item: cc.Node[] = []

    @property(cc.Node)
    n_load_icon: cc.Node = null

    /** 设置动画 */
    set_anima() {
        this.schedule(() => { this.n_load_icon.rotation += 45 }, 0.1, cc.macro.REPEAT_FOREVER)
    }

}