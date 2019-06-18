import { FMPanel, FMPanelExtends, FMPanelConfig } from "../framework/fm-panel";

const { ccclass, property, menu } = cc._decorator;
const C = {
    BORDER: 100,
    BTN_Y: -50,
}

/** 界面打开参数接口 */
interface ParamOpen {
    item: string | cc.Node
    f_yes?: () => void
    f_no?: () => void
}

/**
 * [Panel] 一个通用的message页面
 */
@ccclass
@menu("panel/PanelMessage")
@FMPanelConfig("PanelMessage", "cover")
export class PanelMessage extends FMPanelExtends {

    async on_open(param: ParamOpen) {
        if (typeof param.item === "string") {
            this.label_message.string = param.item
        } else if (param.item instanceof cc.Node) {
            this.label_message.string = ""
            let n = cc.instantiate(param.item)
            n.parent = this.label_message.node
            n.active = true
        } else {

        }
        this.f_yes = param.f_yes
        this.f_no = param.f_no
        this.btn_no.active = !!this.f_no
        await FMPanel.in_scale(this.node)
    }

    async on_close() {
        await FMPanel.out_scale(this.node)
    }

    f_yes: () => void = null
    f_no: () => void = null

    @property(cc.Label)
    label_message: cc.Label = null

    @property(cc.Node)
    btn_no: cc.Node = null

    event_ok() {
        this.f_yes && this.f_yes()
        FMPanel.close(PanelMessage, {})
    }

    event_cancel() {
        this.f_no && this.f_no()
        FMPanel.close(PanelMessage, {})
    }
}