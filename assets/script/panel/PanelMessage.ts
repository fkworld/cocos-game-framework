import { MPanel, MPanelImplements } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator;
const C = {
    BORDER: 100,
    BTN_Y: -50,
}

/**
 * [Panel] 一个通用的message页面
 */
@ccclass
@menu("panel/PanelMessage")
export class PanelMessage extends cc.Component implements MPanelImplements {

    static path = 'PanelMessage'

    /**
     * 打开message页面
     * @param item 传入string或者cc.Node
     * @param f_yes
     * @param f_no 为null则不显示no按钮
     */
    static async open(item: string | cc.Node, f_yes: () => void = null, f_no: () => void = null) {
        await MPanel.open(PanelMessage, item, f_yes, f_no)
    }

    static async close() {
        await MPanel.close(PanelMessage)
    }

    async on_open(item: string | cc.Node, f_yes: () => void, f_no: () => void) {
        if (typeof item === 'string') {
            this.label_message.string = item
            this.scheduleOnce(() => {
                this.content.height = this.label_message.node.height + C.BORDER
                this.layout_btn.y = -this.content.height / 2 + C.BTN_Y
            }, 0)
        } else if (item instanceof cc.Node) {
            this.label_message.string = ''
            let n = cc.instantiate(item)
            n.parent = this.content
            n.active = true
            this.content.height = n.height + C.BORDER
            this.content.width = n.width + C.BORDER
        } else {

        }
        this.f_yes = f_yes
        this.f_no = f_no
        this.layout_btn.y = -this.content.height / 2 + C.BTN_Y
        this.btn_no.active = !!f_no
        await MPanel.in_scale(this.content)
    }

    async on_close() {
        await MPanel.out_scale(this.content)
    }

    f_yes: () => void = null
    f_no: () => void = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Label)
    label_message: cc.Label = null

    @property(cc.Node)
    layout_btn: cc.Node = null

    @property(cc.Node)
    btn_no: cc.Node = null

    event_ok() {
        if (this.f_yes) { this.f_yes() }
        PanelMessage.close()
    }

    event_cancel() {
        if (this.f_no) { this.f_no() }
        PanelMessage.close()
    }
}
