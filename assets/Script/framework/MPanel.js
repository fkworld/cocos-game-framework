import MRes from "./MRes";

const { ccclass, property } = cc._decorator
/** 配置参数 */
const C = {
    /** 默认动作时间 */
    DEFAULT_TIME: 0.2,
}
Object.freeze(C)

/**
 * 框架文件：游戏panel管理类
 * - 封装load，show，hide的外部接口
 * - 将所有的panel prefab资源创建为node，并保存在传入的父节点下
 * - 游戏窗口有多种打开方式：默认打开方式、其他规定的打开方式，规定之外的自定义打开方式
 */
@ccclass
export default class MPanel extends cc.Component {

    /** @type {MPanel} */
    static ins;

    /** @type {cc.Node} panel挂载的父节点 */
    @property(cc.Node)
    panel_parent = null

    onLoad() {
        MPanel.ins = this

        /** 当前的渲染 */
        this.now_z_index = 0
        /** @type {Object<cc.Prefab>} panel存储object（考虑到ES6的支持情况，暂时不要使用Map结构）*/
        this.object_panel = {}
        /** @type {Object<cc.Node>} 新建的panel节点 */
        this.object_node = {}
    }

    /** 数据转换 */
    trans_array_to_object() {
        for (let prefab of MRes.ins.array_panel) {
            this.object_panel[prefab.name] = prefab
        }
    }

    /**
     * 打开panel
     * @param {string} panel_name 窗口名
     */
    panel_open(panel_name) {
        // 获取prefab
        let panel = this.object_panel[panel_name]
        if (panel === undefined) {
            cc.error("需要显示的panel不存在，panel_name=", panel_name)
            return
        }
        // 删除同名节点
        let old_node = this.object_node[panel_name]
        if (old_node != undefined) {
            old_node.stopAllActions()
            old_node.removeFromParent()
            old_node.destroy()
        }
        // 创建节点
        let node = cc.instantiate(panel)
        node.parent = this.panel_parent
        node.active = false
        node.position = cc.Vec2.ZERO;
        [node.width, node.height] = [cc.winSize.width, cc.winSize.height];
        node.stopAllActions()
        // 打开节点
        try {
            // 优先采用窗口自带的显示方式
            node.getComponent(panel_name).open()
        } catch (error) {
            // 如果没有自带的显示方式，则调用默认显示方式
            MPanel.open(node)
        }
        // 修改渲染深度，使其置于顶部
        this.now_z_index += 1
        node.zIndex = this.now_z_index
        // 保存节点
        this.object_node[panel_name] = node
    }

    /**
     * 关闭panel
     * @param {string} panel_name 
     */
    panel_close(panel_name) {
        // 获取节点
        let node = this.object_node[panel_name]
        if (node === undefined) {
            cc.error("需要关闭的panel不存在，panel_name=", panel_name)
            return
        }
        node.stopAllActions()
        // 关闭节点
        try {
            node.getComponent(panel_name).close()
        } catch (error) {
            MPanel.close(node)
        }
    }

    //////////
    // 默认方法
    //////////

    /**
     * 统一的窗口默认显示方式，在MPanel中调用，不需要在各个子窗口中调用
     * @param {cc.Node} panel_node
     * @static
     */
    static open(panel_node) {
        MPanel.open_with_nothing(panel_node)
    }

    /**
     * 统一的窗口默认隐藏方式，在MPanel中调用，不需要在各个子窗口中调用
     * @param {cc.Node} panel_node
     * @static
     */
    static close(panel_node) {
        MPanel.close_with_nothing(panel_node)
    }

    //////////
    // 以下方法为具体show和hide实现方法
    //////////

    /** 
     * 打开panel：没有任何动画
     * @param {cc.Node} panel_node
     * @static
     */
    static open_with_nothing(panel_node) {
        panel_node.active = true
    }

    /** 
     * 关闭panel：没有任何动画
     * @param {cc.Node} panel_node
     * @static
     */
    static close_with_nothing(panel_node) {
        panel_node.active = false
        panel_node.removeFromParent()
        panel_node.destroy()
    }

    /** 
     * 打开panel：放大缩小动画
     * @param {cc.Node} panel_node
     * @returns {number} 动画持续时间
     * @static
     */
    static open_with_scale(panel_node) {
        panel_node.scale = 0
        panel_node.active = true // 特别注意：只有当node.active为true时，才可以执行动作；因此在前摇结束后需要保证node.active为true
        panel_node.runAction(cc.scaleTo(C.DEFAULT_TIME, 1))
        return C.DEFAULT_TIME
    }

    /** 
     * 关闭panel：放大缩小动画
     * @param {cc.Node} panel_node
     * @returns {number} 动画持续时间
     * @static
     */
    static close_with_scale(panel_node) {
        panel_node.runAction(cc.sequence(
            cc.scaleTo(C.DEFAULT_TIME, 0),
            cc.callFunc(() => {
                MPanel.close_with_nothing(panel_node)
            })
        ))
        return C.DEFAULT_TIME
    }

    /** 
     * 打开panel：透明度改变动画
     * @param {cc.Node} panel_node
     * @returns {number} 动画持续时间
     * @static
     */
    static open_with_fade(panel_node) {
        panel_node.opacity = 0
        panel_node.active = true // 特别注意：只有当node.active为true时，才可以执行动作；因此在前摇结束后需要保证node.active为true
        panel_node.runAction(cc.fadeIn(C.DEFAULT_TIME))
        return C.DEFAULT_TIME
    }

    /** 
     * 关闭panel：透明度改变动画
     * @param {cc.Node} panel_node
     * @returns {number} 动画持续时间
     * @static
     */
    static close_with_fade(panel_node) {
        panel_node.runAction(cc.sequence(
            cc.fadeOut(C.DEFAULT_TIME),
            cc.callFunc(() => {
                MPanel.close_with_nothing(panel_node)
            })
        ))
        return C.DEFAULT_TIME
    }
}