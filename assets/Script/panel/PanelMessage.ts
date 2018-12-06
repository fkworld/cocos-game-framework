import MPanel from "../framework/MPanel";

const { ccclass, property } = cc._decorator;

/**
 * [framework-panel] Message+system
 */
@ccclass
export default class PanelMessage extends cc.Component {

    static open(message: string) {
        MPanel.open('PanelMessage', message)
    }

    static close() {
        MPanel.close('PanelMessage')
    }

    async open(message: string) {
        this.label_message.string = message
        this.content.getComponent(cc.Widget).updateAlignment() // 自动的会出问题，这里禁用cc.Widget，改为手动调用1次
        await MPanel.in_scale(this.content)
    }

    async close() {
        await MPanel.out_scale(this.content)
    }

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Label)
    label_message: cc.Label = null

    /** click event close */
    event_close() {
        MPanel.close('PanelMessage')
    }
}
