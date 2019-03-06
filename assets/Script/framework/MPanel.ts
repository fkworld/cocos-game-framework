import { G } from "./G";
import { MRes } from "./MRes";
import { MLog } from "./MLog";

/** 移动方向 */
enum DIRECTION { LEFT, RIGHT, TOP, BOTTOM, LEFT_TOP, LEFT_BOTTOM, RIGHT_TOP, RIGHT_BOTTOM }
const C = {
    PATH: 'panel',
    TIME: 0.5,
    EASE_IN: cc.easeExponentialOut(),
    EASE_OUT: cc.easeExponentialOut(),
    DIRECTION_VEC2: [               // 移动方向对应的方向向量
        cc.v2(-1, 0), cc.v2(1, 0), cc.v2(0, 1), cc.v2(0, -1),
        cc.v2(-1, 1), cc.v2(-1, -1), cc.v2(1, 1), cc.v2(1, -1),
    ],
    SCALE_0: 0.001,                 // 某些组件在scale=0时会出现一些错位等问题，因此将初始值设为0.001
    SCALE_1: 1,
    FADE_MOVE_DISTANCE: 100,        // 在fade-move模式下的移动距离
    FADE_SCALE_TARGET: 2,           // 在fade-scale模式下的目标scale
}

/** 每个子panel的实现类，通过implements */
export class MPanelImplements extends cc.Component {
    static async open(...param: any[]): Promise<void> { }      // open方法，注意static+async，并内部实现MPanel.open()
    static async close(...param: any[]): Promise<void> { }     // close方法，注意static+async，并内部实现MPanel.close()
    async on_open(...param: any[]): Promise<void> { }          // open动画
    async on_close(...param: any[]): Promise<void> { }         // close动画
}

/**
 * [M] 游戏窗口管理
 * - 封装窗口打开的open\close接口，API为open\close
 * - 封装窗口中UI打开的in\out接口，API为in\out+type
 * - [注意] 为了避免通过MPanel调用时无法注释每个窗口参数对应的意义，建议在各子窗口中实现相应的static方法标明参数含义
 * - [注意] 未来可能需要调整并增加node.stopAllActions()
 * - [注意] 目前仅支持同种窗口单个单个显示
 * - [注意] 虽然格式上是static函数，但是需要在AppMain中实例化，使用到了MPanel.ins
 */
export class MPanel {

    static ins: MPanel

    static init(parent_node: cc.Node) {
        G.check_ins(MPanel)
        MPanel.ins = new MPanel()
        MPanel.ins.parent = parent_node
        MPanel.ins.now_z_index = 0
    }

    /** 挂载父节点 */
    parent: cc.Node
    /** 当前的渲染层级 */
    now_z_index: number
    /** panel-实例节点存储 */
    obj_node: { string: cc.Node } | {} = {}
    /** panel-prefab存储 */
    obj_prefab: { string: cc.Prefab } | {} = {}

    /**
     * 打开panel
     * @param panel_name
     * @param param
     * @static @async
     */
    static async open(panel_name: string, ...param: any[]) {
        // 考虑异步延迟，记录当前打开panel应该的z_index
        const z_index = MPanel.ins.now_z_index += 1
        // 载入prefab
        let prefab: cc.Prefab = MPanel.ins.obj_prefab[panel_name]
        if (!prefab) {
            prefab = await MRes.load_res(`${C.PATH}/${panel_name}`, cc.Prefab)
            MPanel.ins.obj_prefab[prefab.name] = prefab
        }
        // 需要载入的prefab并不存在
        if (!prefab) {
            MLog.error(`@${MPanel.name}: panel open fail, panel_name=${panel_name}`)
            return
        }
        // 删除同名节点
        let node = MPanel.ins.obj_node[panel_name]
        if (node) { node.destroy() }
        // 实例化prefab
        node = cc.instantiate(prefab)
        node.setParent(MPanel.ins.parent)
        node.position = cc.Vec2.ZERO
        node.width = cc.winSize.width
        node.height = cc.winSize.height
        node.zIndex = z_index
        node.active = true
        // 保存节点
        MPanel.ins.obj_node[panel_name] = node
        // 执行节点打开动画
        let c: MPanelImplements = node.getComponent(panel_name)
        if (c && c.on_open) { await c.on_open(...param) }
    }

    /**
     * 关闭panel
     * @param panel_name
     * @static @async
     */
    static async close(panel_name: string, ...param: any[]) {
        // 获取节点
        let node: cc.Node = MPanel.ins.obj_node[panel_name]
        if (!node) {
            MLog.error(`@${MPanel.name}: panel close fail, panel_name=${panel_name}`)
            return
        }
        // 执行节点关闭动画
        let c: MPanelImplements = node.getComponent(panel_name)
        if (c && c.on_close) { await c.on_close(...param) }
        // 删除节点存储
        node.destroy()
        delete MPanel.ins.obj_node[panel_name]
    }

    /**
     * [暂时弃用] 链式打开多个panel
     * - 打开的panel无参数传入
     * - 默认interval为1s
     * @param array_panel_name 多个panel的name
     * @static @async
     */
    static async chain(...array_panel_name: string[]) {
        for (let name of array_panel_name) {
            await MPanel.open(name)
            await G.wait_time(1)
        }
    }

    //////////
    // 配置的默认数值
    //////////

    static get TIME() { return C.TIME }
    static get EASE_IN() { return C.EASE_IN }
    static get EASE_OUT() { return C.EASE_OUT }
    static get DIRECTION() { return DIRECTION }

    //////////
    // UI方法
    //////////

    /** 
     * @param node
     * @static @async
     */
    static async in_nothing(node: cc.Node) {
        node.active = true
    }

    /** 
     * @param node
     * @static @async
     */
    static async out_nothing(node: cc.Node) {
        node.active = false
    }

    /** 
     * @param node
     * @param time
     * @param ease
     * @static @async
     */
    static async in_scale(node: cc.Node, time: number = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            node.scale = C.SCALE_0
            node.active = true
            node.runAction(cc.sequence(
                cc.scaleTo(time, C.SCALE_1).easing(ease),
                cc.callFunc(res),
            ))
        })
    }

    /** 
     * @param node
     * @param time
     * @param ease
     * @static @async
     */
    static async out_scale(node: cc.Node, time: number = C.TIME, ease = C.EASE_OUT) {
        await new Promise(res => {
            node.runAction(cc.sequence(
                cc.scaleTo(time, C.SCALE_0).easing(ease),
                cc.callFunc(res),
            ))
        })
    }

    /** 
     * @param node
     * @param time
     * @param ease
     * @static @async
     */
    static async in_fade(node: cc.Node, time: number = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            node.opacity = 0
            node.active = true
            node.runAction(cc.sequence(
                cc.fadeIn(time).easing(ease),
                cc.callFunc(res),
            ))
        })
    }

    /** 
     * @param node
     * @param time
     * @param ease
     * @static @async
     */
    static async out_fade(node: cc.Node, time: number = C.TIME, ease = C.EASE_OUT) {
        await new Promise(res => {
            node.runAction(cc.sequence(
                cc.fadeOut(time).easing(ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * @param node 
     * @param direction 
     * @param time 
     * @param ease 
     * @static @async
     */
    static async in_move(node: cc.Node, direction: DIRECTION = DIRECTION.LEFT, time = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            G.check_widget(node)
            const start_position: cc.Vec2 = node.position.add(C.DIRECTION_VEC2[direction].mul(Math.max(cc.winSize.width, cc.winSize.height)))
            const end_postion: cc.Vec2 = node.position
            node.position = start_position
            node.active = true
            node.runAction(cc.sequence(
                cc.moveTo(time, end_postion).easing(ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * @param node 
     * @param direction 
     * @param time 
     * @param ease 
     * @static @async
     */
    static async out_move(node: cc.Node, direction: DIRECTION = DIRECTION.LEFT, time = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            G.check_widget(node)
            const start_position: cc.Vec2 = node.position
            const end_postion: cc.Vec2 = node.position.add(C.DIRECTION_VEC2[direction].mul(Math.max(cc.winSize.width, cc.winSize.height)))
            node.runAction(cc.sequence(
                cc.moveTo(time, end_postion).easing(ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 组合效果：fade+move
     * @param node 
     * @param direction 
     * @param time 
     * @param ease 
     * @static @async
     */
    static async in_fade_move(node: cc.Node, direction: DIRECTION = DIRECTION.LEFT, time = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            G.check_widget(node)
            const start_position: cc.Vec2 = node.position.add(C.DIRECTION_VEC2[direction].mul(C.FADE_MOVE_DISTANCE))
            const end_position: cc.Vec2 = node.position
            node.position = start_position
            node.opacity = 0
            node.runAction(cc.spawn(
                cc.moveTo(time, end_position).easing(ease),
                cc.fadeIn(time).easing(ease),
                cc.sequence(cc.delayTime(time), cc.callFunc(res)),
            ))
        })
    }

    /**
     * 组合效果：fade+move
     * @param node 
     * @param direction 
     * @param time 
     * @param ease 
     * @static @async
     */
    static async out_fade_move(node: cc.Node, direction: DIRECTION = DIRECTION.LEFT, time = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            G.check_widget(node)
            const start_position: cc.Vec2 = node.position
            const end_position: cc.Vec2 = node.position.add(C.DIRECTION_VEC2[direction].mul(C.FADE_MOVE_DISTANCE))
            node.position = start_position
            node.runAction(cc.spawn(
                cc.moveTo(time, end_position).easing(ease),
                cc.fadeOut(time).easing(ease),
                cc.sequence(cc.delayTime(time), cc.callFunc(res)),
            ))
        })
    }

    /**
     * 组合效果：fade+scale
     * @param node 
     * @param target_scale 
     * @param time 
     * @param ease 
     * @static @async
     */
    static async in_fade_scale(node: cc.Node, target_scale: number = C.FADE_SCALE_TARGET, time = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            node.scale = target_scale
            node.opacity = 0
            node.runAction(cc.spawn(
                cc.fadeIn(time).easing(ease),
                cc.scaleTo(time, C.SCALE_1).easing(ease),
                cc.sequence(cc.delayTime(time), cc.callFunc(res)),
            ))
        })
    }

    /**
     * 组合效果：fade+scale
     * @param node 
     * @param target_scale 
     * @param time 
     * @param ease 
     * @static @async
     */
    static async out_fade_sacle(node: cc.Node, target_scale: number = C.FADE_SCALE_TARGET, time = C.TIME, ease = C.EASE_IN) {
        await new Promise(res => {
            node.runAction(cc.spawn(
                cc.fadeOut(time).easing(ease),
                cc.scaleTo(time, target_scale).easing(ease),
                cc.sequence(cc.delayTime(time), cc.callFunc(res)),
            ))
        })
    }
}