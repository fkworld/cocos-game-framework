import { MPanel } from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [framework-Panel] Wait+system
 * - 逻辑与UI合并，逻辑使用static函数编写，UI使用实例函数编写
 */
@ccclass
export class PanelWait extends cc.Component {

    static open() { MPanel.open('PanelWait') }

    static close() { MPanel.close('PanelWait') }

    async open() {
        for (let n of this.array_ui_item) {
            MPanel.in_scale(n)
        }
        this.set_anima()
    }

    async close() {
        let anima = []
        for (let n of this.array_ui_item) {
            anima.push(MPanel.out_scale(n))
        }
        return await Promise.all(anima)
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