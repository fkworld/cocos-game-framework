import { FPanel } from "../framework/FPanel";
import { TChild } from "../framework/TChild";

const { ccclass, property, menu } = cc._decorator;

/**
 * [Panel] PanelMessage,一个简单的message页面
 */
@ccclass
@menu("panel/PanelMessage")
export class PanelMessage extends cc.Component implements FPanel.FPanelTemplate {

    static context = FPanel.set_panel_context({
        path: "PanelMessage",
        type_open: null as {},
        type_close: null as {},
        z_index_base: 1000,
        ins: null as PanelMessage,
    })

    async on_open() {
        this.msg_box.active = false
    }

    async on_close() { }

    /** 消息面板,包括消息内容,至少1个至多2个操作 */
    @property({ tooltip: "msg-box", type: cc.Node })
    private msg_box: cc.Node = null

    /** 消息toast,包括消息内容,不包含操作,显示2s后隐藏 */
    @property({ tooltip: "msg-toast", type: cc.Node })
    private msg_toast: cc.Node = null

    /**
     * 显示一个msg-box
     * @param msg
     * @param f_ok
     * @param f_cancel
     */
    async show_msg_box(msg: string, f_ok?: Function, f_cancel?: Function) {
        // 创建并执行动画
        let n = cc.instantiate(this.msg_box)
        n.parent = this.node
        n.active = true
        FPanel.bind_ui_state_data(n, {
            "show": { scale: 1 },
            "hide": { scale: 0 },
        })
        // 修改内容
        let n_child = {
            msg: TChild.get_child(n, "label-msg").getComponent(cc.Label),
            btn_ok: TChild.get_child(n, "btn-ok").getComponent(cc.Button),
            btn_cancel: TChild.get_child(n, "btn-cancel").getComponent(cc.Button),
        }
        n_child.msg.string = msg
        n_child.btn_ok.node.active = true
        n_child.btn_ok.node.x = !!f_cancel ? -100 : 0
        n_child.btn_cancel.node.active = !!f_cancel
        FPanel.bind_ui_btn_event(n_child.btn_ok, async () => {
            f_ok && await f_ok()
            await FPanel.anima_ui(n, { key: "hide", ease: "backIn" })
            n.destroy()
        })
        FPanel.bind_ui_btn_event(n_child.btn_cancel, async () => {
            f_cancel && await f_cancel()
            await FPanel.anima_ui(n, { key: "hide", ease: "backIn" })
            n.destroy()
        })
        // 动画过程
        FPanel.set_ui(n, "hide")
        FPanel.anima_ui(n, { key: "show", ease: "backOut" })
    }

    /**
     * 显示一个msg-toast
     * @param msg
     * @param time 持续时间,默认为2s
     */
    async show_msg_toast(msg: string, time: number = 2) {
        // TODO
    }
}
