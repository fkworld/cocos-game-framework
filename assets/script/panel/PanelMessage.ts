import { FAnima } from "../framework/FAnima";
import { fm_panel_config, FPanel, FPanelExtends } from "../framework/FPanel";

const { ccclass, property, menu } = cc._decorator;
const C = {
    BORDER: 100,
    BTN_Y: -50,
}

/** 界面打开关闭参数 */
interface Params {
    Open: {
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
@fm_panel_config("PanelMessage", "cover")
export class PanelMessage extends FPanelExtends {

    async on_open(params: Params["Open"]) {
        this.label_message.string = params.msg
        this.f_yes = params.f_yes
        this.f_no = params.f_no
        this.btn_no.active = !!this.f_no
        await FAnima.in_scale(this.node, {})
    }

    async on_close() {
        await FAnima.out_scale(this.node, {})
    }

    private f_yes: () => void = null
    private f_no: () => void = null

    @property(cc.Label)
    private label_message: cc.Label = null

    @property(cc.Node)
    private btn_no: cc.Node = null

    private event_yes() {
        this.f_yes && this.f_yes()
        FPanel.close(PanelMessage, {})
    }

    private event_no() {
        this.f_no && this.f_no()
        FPanel.close(PanelMessage, {})
    }
}