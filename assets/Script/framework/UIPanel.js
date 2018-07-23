/**
 * 框架文件：游戏窗口的方法封装类
 */
export default class UIPanel {

    /**
     * 构造函数
     * @param {cc.Node} node 窗口节点
     */
    constructor(node) {
        this.node = node
    }

    /** 窗口节点
     * @returns {cc.Node}
     */
    get node() { return this._node }
    set node(node) { this._node = node }

    /**
     * 封装方法：显示窗口
     * - 为了统一窗口显示方式，在外部调用时尽量只通过这个方法
     */
    show() {
        this.panel_node.stopAllActions()
        // 特别要注意这里
        // 可能会出现多次调用hide()方法，但是当第一个hide()方法执行成功后，节点隐藏，其余的hide()方法为静默状态
        // 下次show()的时候，则会继续执行静默的hide()方法，导致界面异常隐藏掉

        // this.show_with_nothing()
        this.show_with_scale()
    }

    /**
     * 封装方法：隐藏窗口
     * - 为了统一窗口隐藏方式，在外部调用时尽量只通过这个方法
     */
    hide() {
        // this.hide_with_nothing()
        this.hide_with_scale()
    }

    // 具体的show和hide实现方法

    /** 显示窗口：没有任何动画 */
    show_with_nothing() {
        this.panel_node.active = true
    }

    /** 隐藏窗口：没有任何动画 */
    hide_with_nothing() {
        this.panel_node.active = false
    }

    /** 显示窗口：放大缩小动画 */
    show_with_scale() {
        this.panel_node.scale = 0
        this.show_with_nothing()
        let action = cc.scaleTo(0.2, 1)
        this.panel_node.runAction(action)
    }

    /** 隐藏窗口：放大缩小动画 */
    hide_with_scale() {
        this.panel_node.scale = 1
        let action = cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                this.hide_with_nothing()
            })
        )
        this.panel_node.runAction(action)
    }
}
