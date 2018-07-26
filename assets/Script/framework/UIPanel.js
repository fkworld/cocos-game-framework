/** 配置参数 */
const C = {
    /** 默认动作时间 */
    DEFAULT_TIME: 0.2,
}

/**
 * 框架文件：游戏窗口的方法封装类
 * @author fengyong
 * @class
 */
export default class UIPanel {

    /**
     * 构造函数：传入窗口的根节点
     * @param {cc.Node} node 窗口根节点
     */
    constructor(node) {
        this.node = node
    }

    /** 
     * 窗口节点
     * @type {cc.Node}
     */
    get node() { return this._node }
    set node(node) { this._node = node }

    /**
     * 封装方法：显示窗口
     * - 为了统一窗口显示方式，在外部调用时尽量只通过这个方法
     */
    show() {
        this.node.stopAllActions()
        // 特别要注意这里
        // 可能会出现多次调用hide()方法，但是当第一个hide()方法执行成功后，节点隐藏，其余的hide()方法为静默状态
        // 下次show()的时候，则会继续执行静默的hide()方法，导致界面异常隐藏掉

        // 设置默认的显示方式
        this.show_with_scale()
    }

    /**
     * 封装方法：隐藏窗口
     * - 为了统一窗口隐藏方式，在外部调用时尽量只通过这个方法
     */
    hide() {
        this.hide_with_scale()
    }

    //////////
    // 以下方法为具体show和hide实现方法
    //////////

    /** 显示窗口：没有任何动画 */
    show_with_nothing() {
        this.node.active = true
    }

    /** 隐藏窗口：没有任何动画 */
    hide_with_nothing() {
        this.node.active = false
    }

    /** 
     * 显示窗口：放大缩小动画
     * @returns {number} action time
     */
    show_with_scale() {
        let time = C.DEFAULT_TIME
        let action = cc.scaleTo(time, 1)

        // 前摇
        // 特别注意：只有当node.active为true时，才可以执行动作；因此在前摇结束后需要保证node.active为true
        this.node.scale = 0
        this.show_with_nothing()
        // 动作
        this.node.runAction(action)

        return time
    }

    /** 隐藏窗口：放大缩小动画
     * @returns {number} action time
     */
    hide_with_scale() {
        let time = C.DEFAULT_TIME
        let action = cc.sequence(
            cc.scaleTo(time, 0),
            cc.callFunc(() => {
                this.hide_with_nothing()
            })
        )

        // 前摇
        // 动作
        this.node.runAction(action)

        return time
    }
}
