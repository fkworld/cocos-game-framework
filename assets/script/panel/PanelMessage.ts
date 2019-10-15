import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator;

/**
 * [Panel] 一个通用的message页面
 */
@ccclass
@menu("panel/PanelMessage")
export class PanelMessage extends cc.Component implements FPanel.FPanelTemplate {

    CONFIG = {
        path: "PanelBase",
        is_multiple: false,
        type_open: null as {
            msg: string,        // 消息内容
            f_yes?: Function,   // 点击确定按钮后的回调
            f_no?: Function,    // 点击取消按钮后的回调
        },
        type_close: null as {},
    }

    async on_open(params: typeof PanelMessage.prototype.CONFIG.type_open) {
        this.label_message.string = params.msg
        this.f_yes = params.f_yes
        this.f_no = params.f_no
        this.btn_no.active = !!this.f_no
        FPanel.set_ui_state_data(this.node, { scale: 1 }, { scale: 0 })
        await FPanel.in_ui(this.node, { ease: "backOut" })
    }

    async on_close() {
        await FPanel.out_ui(this.node, { ease: "backIn" })
    }

    private f_yes: Function = null
    private f_no: Function = null

    @property(cc.Node)
    private page: cc.Node = null

    @property(cc.Label)
    private label_message: cc.Label = null

    @property(cc.Node)
    private btn_no: cc.Node = null

    private event_yes() {
        this.f_yes && this.f_yes()
        FPanel.close_self(this)
    }

    private event_no() {
        this.f_no && this.f_no()
        FPanel.close_self(this)
    }
}
