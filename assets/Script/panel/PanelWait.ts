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

}