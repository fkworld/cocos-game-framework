import { G } from "./G";
import { MLog } from "./MLog";

/** 移动方向 */
enum DIRECTION { left, right, up, down, left_up, left_down, right_up, right_down }
const C = {
    BASE_PATH: 'panel',
    TIME: 0.3,
    EASE_IN: cc.easeCubicActionOut(),
    EASE_OUT: cc.easeCubicActionIn(),
    DIRECTION_VEC2: {
        left: cc.v2(-1, 0),
        right: cc.v2(1, 0),
        up: cc.v2(0, 1),
        down: cc.v2(0, -1),
        left_up: cc.v2(-1, 1),
        left_down: cc.v2(-1, -1),
        right_up: cc.v2(1, 1),
        right_down: cc.v2(1, -1),
    },
    SCALE_0: 0.01,                  // 某些组件在scale=0时会出现异常，因此将初始值设为0.01
    SCALE_1: 1,
    FADE_0: 1,                      // 某些组件在opacity=0时会出现异常，因此将初始值设为1
    FADE_1: 255,
    FADE_MOVE_DISTANCE: 100,        // 在fade-move模式下的移动距离
    FADE_SCALE_TARGET: 2,           // 在fade-scale模式下的目标scale
}

/** 动作的基础参数 */
interface ACTION_PARAM {
    time?: number,
    delay?: number,
    ease?: any,
}

/** 每个子panel的实现类，通过implements */
export class MPanelImplements extends cc.Component {
    static path: string = ''                                    // 对应的prefab路径
    static async open(...param: any[]): Promise<void> { }       // open方法，注意static+async，并内部实现MPanel.open()
    static async close(...param: any[]): Promise<void> { }      // close方法，注意static+async，并内部实现MPanel.close()
    async on_open(...param: any[]): Promise<void> { }           // open动画
    async on_close(...param: any[]): Promise<void> { }          // close动画
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
    private parent: cc.Node
    /** 当前的渲染层级 */
    private now_z_index: number
    /** panel-实例节点存储 */
    private obj_node: { [key: string]: cc.Node } = {}
    /** panel-prefab存储 */
    private obj_prefab: { [key: string]: cc.Prefab } = {}

    /**
     * 打开panel
     * @param panel 传入panel的类型
     * @param params
     * @static @async
     */
    static async open(panel: typeof MPanelImplements, ...params: any[]) {
        // 考虑异步延迟，记录当前打开panel应该的z_index
        const z_index = MPanel.ins.now_z_index += 1
        // 载入prefab
        let prefab = MPanel.ins.obj_prefab[panel.name]
        if (!prefab) {
            prefab = await G.load_res(`${C.BASE_PATH}/${panel.path}`, cc.Prefab)
            MPanel.ins.obj_prefab[panel.name] = prefab
        }
        // 需要载入的prefab并不存在
        if (!prefab) {
            MLog.error(`@${MPanel.name}: panel open fail, path=${panel.path}`)
            return
        }
        // 删除同名节点
        let node = MPanel.ins.obj_node[panel.name]
        if (node) {
            node.destroy()
        }
        // 实例化prefab
        node = cc.instantiate(prefab)
        node.setParent(MPanel.ins.parent)
        node.position = cc.Vec2.ZERO
        node.width = cc.winSize.width
        node.height = cc.winSize.height
        node.zIndex = z_index
        node.active = true
        // 保存节点
        MPanel.ins.obj_node[panel.name] = node
        // 执行节点打开动画
        let c = node.getComponent(panel)
        if (c && c.on_open) {
            await c.on_open(...params)
        }
    }

    /**
     * 关闭panel
     * @param panel 传入panel的类型
     * @param param
     * @static @async
     */
    static async close(panel: typeof MPanelImplements, ...params: any[]) {
        // 获取节点
        let node = MPanel.ins.obj_node[panel.name]
        if (!node) {
            MLog.error(`@${MPanel.name}: panel close fail, panel_name=${panel.name}`)
            return
        }
        // 执行节点关闭动画
        let c = node.getComponent(panel)
        if (c && c.on_close) {
            await c.on_close(...params)
        }
        // 删除节点存储
        node.destroy()
        delete MPanel.ins.obj_node[panel.name]
    }

    //////////
    // 配置的默认数值
    //////////

    static get TIME() { return C.TIME }
    static get EASE_IN() { return C.EASE_IN }
    static get EASE_OUT() { return C.EASE_OUT }

    //////////
    // UI方法
    //////////

    /** 
     * @param node
     * @static @async
     */
    static in_nothing(node: cc.Node) {
        node.active = true
    }

    /** 
     * @param node
     * @static @async
     */
    static out_nothing(node: cc.Node) {
        node.active = false
    }

    /**
     * 
     * @param node 
     * @param params 
     * @static
     */
    static in_scale(node: cc.Node, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            node.scale = C.SCALE_0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.scaleTo(params.time || C.TIME, C.SCALE_1).easing(params.ease || C.EASE_IN),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 
     * @param node 
     * @param params 
     * @static
     */
    static out_scale(node: cc.Node, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.scaleTo(params.time || C.TIME, C.SCALE_0).easing(params.ease || C.EASE_OUT),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 
     * @param node 
     * @param params 
     * @static
     */
    static in_fade(node: cc.Node, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            node.opacity = C.FADE_0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.fadeIn(params.time || C.TIME).easing(params.ease || C.EASE_IN),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 
     * @param node 
     * @param params 
     * @static
     */
    static out_fade(node: cc.Node, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.fadeOut(params.time || C.TIME).easing(params.ease || C.EASE_OUT),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 
     * @param node 
     * @param direction 方向
     * @param distance 距离，默认为null，会计算Math.max(cc.winSize.width, cc.winSize.height)
     * @param params 
     * @static
     */
    static in_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            G.check_widget(node)
            if (!distance) {
                distance = Math.max(cc.winSize.width, cc.winSize.height)
            }
            const start_position = node.position.add(C.DIRECTION_VEC2[direction].mul(distance))
            const end_postion = cc.Vec2.ZERO
            node.position = start_position
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.moveTo(params.time || C.TIME, end_postion).easing(params.ease || C.EASE_IN),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 
     * @param node 
     * @param direction 
     * @param time 
     * @param ease 
     * @static
     */
    static out_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            if (!distance) {
                distance = Math.max(cc.winSize.width, cc.winSize.height)
            }
            const end_postion = node.position.add(C.DIRECTION_VEC2[direction].mul(distance))
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.moveTo(params.time || C.TIME, end_postion).easing(params.ease || C.EASE_OUT),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 组合效果：fade+move
     * @param node 
     * @param direction 
     * @param distance 
     * @param params 
     * @static
     */
    static in_fade_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            G.check_widget(node)
            const start_position = node.position.add(C.DIRECTION_VEC2[direction].mul(distance || C.FADE_MOVE_DISTANCE))
            const end_position = cc.Vec2.ZERO
            node.position = start_position
            node.opacity = C.FADE_0
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.spawn(
                    cc.fadeIn(params.time || C.TIME).easing(params.ease || C.EASE_IN),
                    cc.moveTo(params.time || C.TIME, end_position).easing(params.ease || C.EASE_IN),
                ),
                cc.callFunc(res)
            ))
        })
    }

    /**
     * 组合效果：fade+move
     * @param node 
     * @param direction 
     * @param distance 
     * @param params 
     */
    static out_fade_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ACTION_PARAM = {}) {
        return new Promise(res => {
            const end_position = node.position.add(C.DIRECTION_VEC2[direction].mul(distance || C.FADE_MOVE_DISTANCE))
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.spawn(
                    cc.moveTo(params.time || C.TIME, end_position).easing(params.ease || C.EASE_IN),
                    cc.fadeOut(params.time || C.TIME).easing(params.ease || C.EASE_IN),
                ),
                cc.callFunc(res)
            ))
        })
    }
}