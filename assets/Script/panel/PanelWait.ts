import MPanel from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [framework-Panel] Wait
 */
@ccclass
export default class PanelWait extends cc.Component {

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