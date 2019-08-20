import { FPanel } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator;

/** 界面打开关闭参数 */
interface Params {
    open: {
        msg: string;
        f_yes?: () => void;
        f_no?: () => void;
    }
}

/**
 * [Panel] 一个通用的message页面
 */
@ccclass
@menu("panel/PanelMessage")
@FPanel.config_panel("PanelMessage", true)
export class PanelMessage extends FPanel.FPanelTemplate {

    async on_open(params: Params["open"]) {
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

    private f_yes: () => void = null
    private f_no: () => void = null

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
