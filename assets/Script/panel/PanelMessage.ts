import { MPanel, MPanelImplements } from "../framework/MPanel";

const { ccclass, property } = cc._decorator;

/**
 * [Panel] Message+system，逻辑与UI合并
 */
@ccclass
export class PanelMessage extends cc.Component implements MPanelImplements {

    static path = 'PanelMessage'

    /**
     * 
     * @param msg 消息内容
     * @param msg_title 消息标题，如果为null则不显示
     * @param f_ok 点击ok按钮执行的方法
     * @param f_cancel 点击cancel按钮执行的方法，为null则不显示
     */
    static async open(msg: string, msg_title = '', f_ok = () => { }, f_cancel = () => { }, ) {
        await MPanel.open(PanelMessage, msg, msg_title, f_ok, f_cancel)
    }

    static async close() {
        await MPanel.close(PanelMessage)
    }

    async on_open(msg: string, msg_title: string, f_ok: () => void, f_cancel: () => void) {
        this.f_ok = f_ok
        this.f_cancel = f_cancel
        this.label_message.string = msg
        this.label_message_title.string = msg_title
        this.btn_cancel.active = !!f_cancel
        this.content.width = this.node.width
        await MPanel.in_move(this.content, MPanel.DIRECTION.RIGHT, 0.5, cc.easeBackOut())
    }

    async on_close() {
        await MPanel.out_move(this.content, MPanel.DIRECTION.LEFT, 0.5, cc.easeBackIn())
    }

    f_ok: () => void = null
    f_cancel: () => void = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Label)
    label_message_title: cc.Label = null

    @property(cc.Label)
    label_message: cc.Label = null

    @property(cc.Node)
    btn_cancel: cc.Node = null

    event_ok() {
        if (this.f_ok) { this.f_ok() }
        PanelMessage.close()
    }

    event_cancel() {
        if (this.f_cancel) { this.f_cancel() }
        PanelMessage.close()
    }
}
