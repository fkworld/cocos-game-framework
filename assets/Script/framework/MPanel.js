import MRes from "./MRes";

const { ccclass, property } = cc._decorator
/** 配置参数 */
const C = {
    /** 默认动作时间 */
    DEFAULT_TIME: 0.2,
}

/**
 * 框架文件：游戏panel管理类
 * - 封装load，show，hide的外部接口
 * - 将所有的panel prefab资源创建为node，并保存在传入的父节点下
 * - 游戏窗口有多种打开方式：默认打开方式、其他规定的打开方式，规定之外的自定义打开方式
 */
@ccclass
export default class MPanel extends cc.Component {

    /** @type {MPanel} */
    static ins

    /** 
     * panel挂载的父节点
     * @type {cc.Node}
     */
    @property(cc.Node)
    panel_parent = null

    /** @type {cc.Node} panel_loading */
    @property(cc.Node)
    panel_loading = null

    onLoad() {
        // 初始化
        /** 当前的渲染 */
        this.now_z_index = 0

        // 初始化存储
        /** panel存储object（考虑到ES6的支持情况，暂时不要使用Map结构）
         * - 每一行的结构为：string:cc.Node
         */
        this.object_all_panel = {}

        // 保存脚本运行实例
        MPanel.ins = this
    }

    /** 创建所有的panel */
    create_all_panel() {
        for (let prefab of MRes.ins.array_panel) {
            // 创建node并写入
            let node = cc.instantiate(prefab)
            node.parent = this.panel_parent
            node.active = false
            this.object_all_panel[prefab.name] = node
        }
        // 匹配loadingpanel
        // 需要prefab里没有同名的panel
        this.object_all_panel["PanelLoading"] = this.panel_loading
        cc.log(this.name, "创建所有UI节点成功")
    }

    /**
     * 检查窗口名称
     * @param {string} panel_name 窗口名称
     * @returns {undefined | cc.Node}
     */
    check_panel(panel_name) {
        let panel = this.object_all_panel[panel_name]
        if (panel === undefined) {
            cc.error("查找的panel不存在，panel_name=", panel_name)
            return undefined // 查询不到的时候会panel=undefined，这里显式返回一下
        }
        return panel
    }

    /**
     * 显示panel
     * @param {string} panel_name 窗口名
     */
    panel_show(panel_name) {
        let panel = this.check_panel(panel_name)
        if (panel === undefined) { return }
        // 特别要注意这里
        // 可能会出现多次调用hide()方法，但是当第一个hide()方法执行成功后，节点隐藏，其余的hide()方法为静默状态
        // 下次show()的时候，则会继续执行静默的hide()方法，导致界面异常隐藏掉
        panel.stopAllActions()
        // 为了避免这一问题，尽量不要在多次调用hide()方法，例如update()中
        try {
            // 优先采用窗口自带的显示方式
            panel.getComponent(panel_name).show()
        } catch (error) {
            // 如果没有自带的显示方式，则调用默认显示方式
            MPanel.show(panel)
        }
        // 修改渲染深度，使其置于顶部
        this.now_z_index += 1
        panel.zIndex = this.now_z_index
    }

    /**
     * 隐藏panel
     * @param {string} panel_name 窗口名
     */
    panel_hide(panel_name) {
        let panel = this.check_panel(panel_name)
        if (panel === undefined) { return }
        // 优先采用窗口自带的关闭方式
        try {
            panel.getComponent(panel_name).hide()
        } catch (error) {
            MPanel.hide(panel)
        }
    }

    //////////
    // 默认方法
    //////////

    /**
     * 统一的窗口默认显示方式，在MPanel中调用，不需要在各个子窗口中调用
     * @static
     * @param {cc.Node} panel_node
     */
    static show(panel_node) {
        MPanel.show_with_nothing(panel_node)
    }

    /**
     * 统一的窗口默认隐藏方式，在MPanel中调用，不需要在各个子窗口中调用
     * @static
     * @param {cc.Node} panel_node
     */
    static hide(panel_node) {
        MPanel.hide_with_nothing(panel_node)
    }

    //////////
    // 以下方法为具体show和hide实现方法
    //////////

    /** 
     * 显示窗口：没有任何动画
     * @static
     * @param {cc.Node} panel_node
     */
    static show_with_nothing(panel_node) {
        panel_node.active = true
    }

    /** 
     * 隐藏窗口：没有任何动画
     * @static
     * @param {cc.Node} panel_node
     */
    static hide_with_nothing(panel_node) {
        panel_node.active = false
    }

    /** 
     * 显示窗口：放大缩小动画
     * @static
     * @param {cc.Node} panel_node
     * @returns {number} action time
     */
    static show_with_scale(panel_node) {
        // 前摇
        panel_node.scale = 0
        panel_node.active = true // 特别注意：只有当node.active为true时，才可以执行动作；因此在前摇结束后需要保证node.active为true
        // 动作
        let action = cc.scaleTo(C.DEFAULT_TIME, 1)
        panel_node.runAction(action)
        return time
    }

    /** 
     * 隐藏窗口：放大缩小动画
     * @static
     * @param {cc.Node} panel_node
     * @returns {number} action time
     */
    static hide_with_scale(panel_node) {
        // 前摇
        // 动作
        let action = cc.sequence(
            cc.scaleTo(C.DEFAULT_TIME, 0),
            cc.callFunc(() => {
                panel_node.active = false
            })
        )
        panel_node.runAction(action)
        return time
    }
}