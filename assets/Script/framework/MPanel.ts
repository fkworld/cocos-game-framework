import MRes from "./MRes";
import G from "./G";

const { ccclass, property } = cc._decorator
/** 配置参数 */
const C = {
    /** 资源所在路径 */
    PATH: 'panel',
    /** 默认动作时间 */
    DEFAULT_TIME: 0.4,
    /** 默认进入场景缓动动画（激烈） */
    DEFAULT_EASE_IN: cc.easeBounceOut(),
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

    static ins: MPanel

    onLoad() {
        MPanel.ins = this
    }

    /** 当前的渲染层级 */
    now_z_index: number = 0

    /** 新建的panel节点存储 */
    object_node = {}

    /** panel挂载的父节点 */
    @property(cc.Node)
    panel_parent: cc.Node = null

    /**
     * 打开panel
     * - 为了格式统一改成static函数，实际上在函数内部使用到了MPanel.ins，因此需要在场景中挂载并激活
     * @param panel_name
     * @static
     * @async
     */
    static async panel_open(panel_name: string): Promise<void> {
        // 由于是异步过程，所以在异步过程前记录MPanel.ins.now_z_index
        MPanel.ins.now_z_index += 1
        let z_index = MPanel.ins.now_z_index
        // 载入资源
        return await MRes.load_res(C.PATH + '/' + panel_name, cc.Prefab)
            .then(v => {
                let panel_prefab: cc.Prefab = v
                // 删除同名节点
                let old_node: cc.Node = MPanel.ins.object_node[panel_name]
                if (old_node != undefined) {
                    old_node.stopAllActions()
                    old_node.removeFromParent()
                    old_node.destroy()
                }
                // 创建节点
                let node = cc.instantiate(panel_prefab)
                node.setParent(MPanel.ins.panel_parent)
                node.active = false
                node.position = cc.Vec2.ZERO
                node.width = cc.winSize.width
                node.height = cc.winSize.height
                node.zIndex = z_index
                // 保存节点
                MPanel.ins.object_node[panel_name] = node
                // 打开节点；优先采用窗口自带的显示方式；如果没有自带的方式，则调用默认方式
                try {
                    node.getComponent(panel_name).open()
                } catch{
                    MPanel.open(node)
                }
            })
            .catch(() => {
                cc.error("需要显示的panel不存在，panel_name=", panel_name)
            })
    }

    /**
     * 关闭panel
     * - 为了格式统一改成static函数，实际上在函数内部使用到了MPanel.ins，因此需要在场景中挂载并激活
     * @param panel_name
     * @static
     * @async
     */
    static async panel_close(panel_name: string): Promise<void> {
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

    /**
     * 链式打开多个panel
     * - 传入的最后一个数字类型的参数将会被视为interval
     * - 还未实现interval
     * @param array_panel_name 多个panel的name
     */
    static async panel_open_chain(...array_panel_name: string[]): Promise<void> {
        for (let i = 0; i < array_panel_name.length; i++) {
            await MPanel.panel_open(array_panel_name[i])
        }
    }

    //////////
    // 默认方法
    //////////

    /** 获取文件中C的default time */
    static get DEFAULT_TIME() { return C.DEFAULT_TIME }

    /** 获取文件中C的default ease in */
    static get DEFAULT_EASE_IN() { return C.DEFAULT_EASE_IN }

    /** 获取文件中C的default ease out */
    static get DEFAULT_EASE_OUT() { return C.DEFAULT_EASE_OUT }

    /**
     * 统一的窗口默认显示方式，在MPanel中调用，不需要在各个子窗口中调用
     * @param panel_node 
     * @static
     * @async
     */
    static async open(panel_node: cc.Node) {
        return await MPanel.open_with_nothing(panel_node)
    }

    /**
     * 统一的窗口默认隐藏方式，在MPanel中调用，不需要在各个子窗口中调用
     * @param panel_node
     * @static
     * @async
     */
    static async close(panel_node: cc.Node) {
        return await MPanel.close_with_nothing(panel_node)
    }

    //////////
    // 以下方法为具体open和close实现方法
    //////////

    /** 
     * 打开panel：没有任何动画
     * @param panel_node
     * @static
     * @async
     */
    static async open_with_nothing(panel_node: cc.Node) {
        panel_node.active = true
    }

    /** 
     * 关闭panel：没有任何动画
     * @param panel_node
     * @static
     * @async
     */
    static async close_with_nothing(panel_node: cc.Node) {
        panel_node.active = false
        panel_node.removeFromParent()
        panel_node.destroy()
    }

    /** 
     * 打开panel：放大缩小动画
     * @param panel_node
     * @param time
     * @param ease
     * @static
     * @async
     */
    static async open_with_scale(panel_node: cc.Node, time: number = C.DEFAULT_TIME, ease: any = C.DEFAULT_EASE_IN) {
        return await new Promise((resolve, reject) => {
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
     * @param panel_node
     * @param time
     * @param ease
     * @static
     * @async
     */
    static async close_with_scale(panel_node: cc.Node, time: number = C.DEFAULT_TIME, ease: any = C.DEFAULT_EASE_OUT) {
        await new Promise((resolve, reject) => {
            panel_node.runAction(cc.sequence(
                cc.scaleTo(time, C.SCALE_0).easing(ease),
                cc.callFunc(resolve),
            ))
        })
        return await MPanel.close_with_nothing(panel_node)
    }

    /** 
     * 打开panel：透明度改变动画
     * @param panel_node
     * @param time
     * @param ease
     * @static
     * @async
     */
    static async open_with_fade(panel_node: cc.Node, time: number = C.DEFAULT_TIME, ease: any = C.DEFAULT_EASE_IN) {
        return await new Promise((resolve, reject) => {
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
     * @param panel_node
     * @param time
     * @param ease
     * @static
     * @async
     */
    static async close_with_fade(panel_node: cc.Node, time: number = C.DEFAULT_TIME, ease = C.DEFAULT_EASE_OUT) {
        await new Promise((resolve, reject) => {
            panel_node.runAction(cc.sequence(
                cc.fadeOut(time).easing(ease),
                cc.callFunc(resolve),
            ))
        })
        return await MPanel.close_with_nothing(panel_node)
    }

    //////////
    // 以下方法为一些有趣但是不实用的open和close实现方法
    //////////

    /** 
     * 打开panel：放大缩小带旋转
     * @param panel_node
     * @param time
     * @param ease
     * @static
     * @async
     */
    static async open_with_scale_rotate(panel_node: cc.Node, time: number = C.DEFAULT_TIME, ease = C.DEFAULT_EASE_IN) {
        return await new Promise((resolve, reject) => {
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
     * @param panel_node
     * @param time
     * @param ease
     * @static
     * @async
     */
    static async close_with_scale_rotate(panel_node: cc.Node, time: number = C.DEFAULT_TIME, ease: any = C.DEFAULT_EASE_OUT) {
        await new Promise((resolve, reject) => {
            panel_node.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(time, C.SCALE_0).easing(ease),
                    cc.rotateBy(time, 360).easing(ease),
                ),
                cc.callFunc(resolve),
            ))
        })
        return await MPanel.close_with_nothing(panel_node)
    }
}