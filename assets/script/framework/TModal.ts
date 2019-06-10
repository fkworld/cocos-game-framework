import { MVersion } from "./MVersion";

const { ccclass, property, requireComponent, menu } = cc._decorator;
const C = {
    TIME: 0.3,
}

/**
 * [T] 一个对话框/子窗口组件
 * - [注意] 目前仅支持固定子窗口,不支持对子窗口的创建,如果是那样则使用MPanel
 * - [注意] 不支持自定义on_show/on_close方法,采用默认的方法:fade-move-scale
 */
@ccclass
@requireComponent(cc.Button)
@menu("framework/TModal")
export class TModal extends cc.Component {

    onLoad() {
        this.modal_position = this.modal.position
        this.modal.active = this.state
    }

    @property({ tooltip: "子窗口节点", type: cc.Node })
    private modal: cc.Node = null

    @property({ tooltip: "载入时的状态是否显示" })
    private state = true

    @property({ tooltip: "预览", type: cc.Boolean })
    private get preview() { return false }
    private set preview(v: boolean) {
        MVersion.is_editor && this.set()
    }

    private modal_position: cc.Vec2;

    /** 设置btn-clickEvents-0 */
    private set() {
        let btn = this.getComponent(cc.Button)
        let event = new cc.Component.EventHandler();
        event.target = this.node
        event.component = TModal.name
        event.handler = "event_click"
        btn.clickEvents[0] = event
    }

    /** 点击事件 */
    private event_click() {
        if (this.state) {
            this.close_modal()
        } else {
            this.open_modal()
        }
    }

    open_modal() {
        this.state = true
        this.modal.position = this.node.position
        this.modal.opacity = 0
        this.modal.scale = 0
        this.modal.active = true
        this.modal.runAction(cc.spawn(
            cc.moveTo(C.TIME, this.modal_position),
            cc.fadeTo(C.TIME, 255),
            cc.scaleTo(C.TIME, 1),
        ))
    }

    close_modal() {
        this.state = false
        this.modal.active = true
        this.modal.runAction(cc.spawn(
            cc.moveTo(C.TIME, this.node.position),
            cc.fadeOut(C.TIME),
            cc.scaleTo(C.TIME, 0)
        ))
    }
}
