import { MPanel, MPanelImplements } from "../framework/MPanel";

const { ccclass, property } = cc._decorator;

/**
 * [Panel] Message+system，逻辑与UI合并
 */
@ccclass
export class PanelMessage extends cc.Component implements MPanelImplements {

    static async open(message: string) { await MPanel.open(PanelMessage.name, message) }
    static async close() { await MPanel.close(PanelMessage.name) }
    async on_open(message: string) {
        this.label_message.string = message
        this.content.getComponent(cc.Widget).updateAlignment() // 自动的会出问题，这里禁用cc.Widget，改为手动调用1次
        await MPanel.in_scale(this.content)
    }
    async on_close() {
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
