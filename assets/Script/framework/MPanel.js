import MRes from "./MRes";

const { ccclass, property } = cc._decorator
/** 配置参数 */
const C = {
    /** 资源所在路径 */
    PATH: 'panel',
    /** 默认动作时间 */
    DEFAULT_TIME: 0.4,
    /** 默认缓动动画（平缓） */
    DEFAULT_EASE: cc.easeCubicActionInOut(),
    /** 默认进入场景缓动动画（激烈） */
    DEFAULT_EASE_IN: cc.easeExponentialOut(),
    /** 默认离开场景缓动动画（激烈） */
    DEFAULT_EASE_OUT: cc.easeExponentialIn(),
    /** 某些组件在scale=0时会出现一些错位等问题，因此将初始值设为0.001 */
    SCALE_0: 0.001,
    SCALE_1: 1,
}
Object.freeze(C)

/**
 * 【框架】游戏窗口管理
 * - 封装open、close的外部接口
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

        /** 当前的渲染层级 */
        this.now_z_index = 0
        /** @type {Object<cc.Node>} 新建的panel节点 */
        this.object_node = {}
    }

    /**
     * 打开panel
     * - 为了格式统一改成static函数，实际上在函数内部使用到了MPanel.ins，因此需要在场景中挂载并激活
     * @param {string} panel_name 窗口名
     * @static
     */
    static panel_open(panel_name) {
        // 载入资源
        MRes.load_res(
            C.PATH + '/' + panel_name,
            cc.Prefab
        ).then((v) => {
            let panel_prefab = v
            // 删除同名节点
            let old_node = MPanel.ins.object_node[panel_name]
            if (old_node != undefined) {
                old_node.stopAllActions()
                old_node.removeFromParent()
                old_node.destroy()
            }
            // 创建节点
            let node = cc.instantiate(panel_prefab)
            node.parent = MPanel.ins.panel_parent
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
            MPanel.ins.now_z_index += 1
            node.zIndex = MPanel.ins.now_z_index
            // 保存节点
            MPanel.ins.object_node[panel_name] = node
        }).catch(() => {
            cc.error("需要显示的panel不存在，panel_name=", panel_name)
        })
    }

    /**
     * 关闭panel
     * - 为了格式统一改成static函数，实际上在函数内部使用到了MPanel.ins，因此需要在场景中挂载并激活
     * @param {string} panel_name 
     * @static
     */
    static panel_close(panel_name) {
        // 获取节点
        let node = MPanel.ins.object_node[panel_name]
        if (node === undefined) {
            cc.warn("需要关闭的panel不存在，panel_name=", panel_name)
            return
        }
        node.stopAllActions()
        // 关闭节点
        try {
            node.getComponent(panel_name).close()
        } catch (error) {
            MPanel.close(node)
        }
        // 删除节点存储
        delete MPanel.ins.object_node[panel_name]
    }

    //////////
    // 默认方法
    //////////

    /** 获取文件中C的default time */
    static get_default_time() { return C.DEFAULT_TIME }

    /** 获取文件中C的default ease */
    static get_default_ease() { return C.DEFAULT_EASE }

    /** 获取文件中C的default ease in */
    static get_default_ease_in() { return C.DEFAULT_EASE_IN }

    /** 获取文件中C的default ease out */
    static get_default_ease_out() { return C.DEFAULT_EASE_OUT }

    /**
     * 统一的窗口默认显示方式，在MPanel中调用，不需要在各个子窗口中调用
     * @param {cc.Node} panel_node
     * @returns {Promise}
     * @static
     */
    static open(panel_node) {
        return MPanel.open_with_nothing(panel_node)
    }

    /**
     * 统一的窗口默认隐藏方式，在MPanel中调用，不需要在各个子窗口中调用
     * @param {cc.Node} panel_node
     * @returns {Promise}
     * @static
     */
    static close(panel_node) {
        return MPanel.close_with_nothing(panel_node)
    }

    //////////
    // 以下方法为具体open和close实现方法
    //////////

    /** 
     * 打开panel：没有任何动画
     * @param {cc.Node} panel_node
     * @returns {Promise}
     * @static
     */
    static open_with_nothing(panel_node) {
        return new Promise((resolve, reject) => {
            panel_node.active = true
            resolve()
        })
    }

    /** 
     * 关闭panel：没有任何动画
     * @param {cc.Node} panel_node
     * @returns {Promise}
     * @static
     */
    static close_with_nothing(panel_node) {
        return new Promise((resolve, reject) => {
            panel_node.active = false
            panel_node.removeFromParent()
            panel_node.destroy()
            resolve()
        })
    }

    /** 
     * 打开panel：放大缩小动画
     * @param {cc.Node} panel_node
     * @param {number} time
     * @param {*} ease
     * @returns {Promise}
     * @static
     */
    static open_with_scale(panel_node, time = C.DEFAULT_TIME, ease = C.DEFAULT_EASE) {
        return new Promise((resolve, reject) => {
            panel_node.scale = C.SCALE_0
            panel_node.active = true
            panel_node.runAction(cc.sequence(
                cc.scaleTo(time, C.SCALE_1).easing(ease),
                cc.callFunc(resolve),
            ))
        })
    }

    /** 
     * 关闭panel：放大缩小动画
     * @param {cc.Node} panel_node
     * @param {number} time
     * @param {*} ease
     * @returns {Promise}
     * @static
     */
    static close_with_scale(panel_node, time = C.DEFAULT_TIME, ease = C.DEFAULT_EASE) {
        return new Promise((resolve, reject) => {
            panel_node.runAction(cc.sequence(
                cc.scaleTo(time, C.SCALE_0).easing(ease),
                cc.callFunc(() => {
                    MPanel.close_with_nothing(panel_node)
                }),
                cc.callFunc(resolve),
            ))
        })
    }

    /** 
     * 打开panel：透明度改变动画
     * @param {cc.Node} panel_node
     * @param {number} time
     * @param {*} ease
     * @returns {Promise}
     * @static
     */
    static open_with_fade(panel_node, time = C.DEFAULT_TIME, ease = C.DEFAULT_EASE) {
        return new Promise((resolve, reject) => {
            panel_node.opacity = 0
            panel_node.active = true
            panel_node.runAction(cc.sequence(
                cc.fadeIn(time).easing(ease),
                cc.callFunc(resolve),
            ))
        })
    }

    /** 
     * 关闭panel：透明度改变动画
     * @param {cc.Node} panel_node
     * @param {number} time
     * @param {*} ease
     * @returns {Promise}
     * @static
     */
    static close_with_fade(panel_node, time = C.DEFAULT_TIME, ease = C.DEFAULT_EASE) {
        return new Promise((resolve, reject) => {
            panel_node.runAction(cc.sequence(
                cc.fadeOut(time).easing(ease),
                cc.callFunc(() => {
                    MPanel.close_with_nothing(panel_node)
                }),
                cc.callFunc(resolve),
            ))
        })
    }

    //////////
    // 以下方法为一些有趣但是不实用的open和close实现方法
    //////////

    /** 
     * 打开panel：放大缩小带旋转
     * @param {cc.Node} panel_node
     * @param {number} time
     * @param {*} ease
     * @returns {Promise}
     * @static
     */
    static open_with_scale_rotate(panel_node, time = C.DEFAULT_TIME, ease = C.DEFAULT_EASE) {
        return new Promise((resolve, reject) => {
            panel_node.scale = C.SCALE_0
            panel_node.active = true
            panel_node.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(time, C.SCALE_1).easing(ease),
                    cc.rotateBy(time, 360).easing(ease),
                ),
                cc.callFunc(resolve),
            ))
        })
    }

    /** 
     * 关闭panel：放大缩小带旋转
     * @param {cc.Node} panel_node
     * @param {number} time
     * @param {*} ease
     * @returns {Promise}
     * @static
     */
    static close_with_scale_rotate(panel_node, time = C.DEFAULT_TIME, ease = C.DEFAULT_EASE) {
        return new Promise((resolve, reject) => {
            panel_node.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(time, C.SCALE_0).easing(ease),
                    cc.rotateBy(time, 360).easing(ease),
                ),
                cc.callFunc(() => {
                    MPanel.close_with_nothing(panel_node)
                }),
                cc.callFunc(resolve),
            ))
        })
    }
}