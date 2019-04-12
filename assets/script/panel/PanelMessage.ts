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

    static path = "PanelMessage"

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
        if (typeof item === "string") {
            this.label_message.string = item
        } else if (item instanceof cc.Node) {
            this.label_message.string = ""
            let n = cc.instantiate(item)
            n.parent = this.label_message.node
            n.active = true
        } else {

        }
        this.f_yes = f_yes
        this.f_no = f_no
        this.btn_no.active = !!f_no
        await MPanel.in_scale(this.node)
    }

    async on_close() {
        await MPanel.out_scale(this.node)
    }

    f_yes: () => void = null
    f_no: () => void = null

    @property(cc.Label)
    label_message: cc.Label = null

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
