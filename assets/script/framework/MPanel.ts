import { G } from "./G";
import { MLog } from "./MLog";

/** 移动方向 */
enum DIRECTION { left, right, up, down, left_up, left_down, right_up, right_down }
const C = {
    BASE_PATH: "panel",
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
    SCALE_0: 0.01,                  // 某些组件在scale=0时会出现异常,因此将初始值设为0.01
    SCALE_1: 1,
    FADE_0: 1,                      // 某些组件在opacity=0时会出现异常,因此将初始值设为1
    FADE_1: 255,
    FADE_MOVE_DISTANCE: 100,        // 在fade-move模式下的移动距离
    FADE_SCALE_TARGET: 2,           // 在fade-scale模式下的目标scale
}
/** 动作的基础参数 */
interface ActionParams {
    time?: number
    delay?: number
    ease?: any
}
/** 每个子panel的抽象类;注意必须实现CONFIG-PATH属性. */
export abstract class MPanelExtends extends cc.Component {
    /** 资源路径;同时也作为唯一key使用 */
    static PATH: string;
    /** 打开方式;single-不允许再次打开;cover-再次打开时覆盖;chain-再次打开时会加入chain */
    static TYPE?: "single" | "cover" | "chain";
    /** 打开界面的参数结构 */
    static OPEN_PARAMS?: object;
    /** 关闭界面的参数结构 */
    static CLOSE_PARAMS?: object;
    /** panel-open-process */
    async on_open(params?: object) { };
    /** panel-close-process */
    async on_close(params?: object) { };
}

/**
 * [M] 游戏窗口管理
 * - 封装窗口打开的open/close接口,API为open/close
 * - 封装窗口中UI打开的in/out接口,API为in/out+type
 * - [注意] 为了避免通过MPanel调用时无法注释每个窗口参数对应的意义,建议在各子窗口中实现相应的static方法标明参数含义
 * - [注意] 未来可能需要调整并增加node.stopAllActions()
 * - [注意] 目前仅支持同种窗口单个单个显示
 * - [注意] 虽然格式上是static函数,但是需要在AppMain中实例化,使用到了MPanel.ins
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
    private parent: cc.Node;
    /** 当前的渲染层级 */
    private now_z_index: number;
    /** panel-实例的map结构存储;包括prefab,node,cmd */
    private map_ins: Map<string, { prefab: cc.Prefab, node: cc.Node, cmd: object[] }> = new Map()

    /**
     * 打开panel
     * @param panel 传入panel的类型
     * @param params
     * @static @async
     */
    static async open<T extends typeof MPanelExtends>(panel: T, params?: T["OPEN_PARAMS"]) {
        // 获取key,value,z_index
        let key = panel.PATH;
        let value = MPanel.ins.map_ins.get(key)
        value = value || { prefab: null, node: null, cmd: [] }
        let z_index = MPanel.ins.now_z_index += 1 // 考虑异步延迟,需要提前获取
        // 获取同名节点进行预处理
        switch (panel.TYPE) {
            default: case "single":
                if (value.node) { return }
                break;
            case "cover":
                if (value.node) { value.node.destroy() }
                break;
            case "chain":
                if (value.node) { value.cmd.push(params); return }
                break;
        }
        // 载入prefab
        let path = panel.PATH
        let prefab = value.prefab || await G.load_res(`${C.BASE_PATH}/${path}`, cc.Prefab)
        // 需要载入的prefab并不存在时,输出log并return;注意name属性在打包后(或者代码混淆后)不可用
        if (!prefab) {
            MLog.error(`@MPanel: panel-prefab-not-exist, name=${panel.name}, path=${path}`)
            return
        }
        // 实例化prefab
        let node = cc.instantiate(prefab)
        node.parent = MPanel.ins.parent
        node.position = cc.Vec2.ZERO
        node.width = cc.winSize.width
        node.height = cc.winSize.height
        node.zIndex = z_index
        node.active = true
        // 重新保存value
        value.node = node
        value.prefab = prefab
        MPanel.ins.map_ins.set(key, value)
        // 执行节点打开动画
        let panel_script = node.getComponent(panel)
        panel_script && await panel_script.on_open(params)
    }

    /**
     * 关闭panel
     * @param panel 传入panel的类型
     * @param param
     * @static @async
     */
    static async close<T extends typeof MPanelExtends>(panel: T, params?: T["CLOSE_PARAMS"]) {
        // 获取key,value
        let key = panel.PATH;
        let value = MPanel.ins.map_ins.get(key)
        value = value || { prefab: null, node: null, cmd: [] }
        // 如果node实例不存在,则输出log并返回
        if (!value.node) {
            MLog.error(`@MPanel: panel-node-not-exist, name=${panel.name}, path=${panel.PATH}`)
            return
        }
        // 执行节点关闭动画
        let panel_script = value.node.getComponent(panel)
        panel_script && await panel_script.on_close(params)
        value.node.destroy()
        // 打开下一个窗口
        if (panel.TYPE === "chain") {
            let cmd = value.cmd.shift()
            if (cmd) {
                MPanel.open(panel, cmd) // 注意此处没有await
            }
        }
        // 重新保存value
        value.node = null
        MPanel.ins.map_ins.set(key, value)
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
    static in_scale(node: cc.Node, params: ActionParams = {}) {
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
    static out_scale(node: cc.Node, params: ActionParams = {}) {
        return new Promise(res => {
            node.active = true
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
    static in_fade(node: cc.Node, params: ActionParams = {}) {
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
    static out_fade(node: cc.Node, params: ActionParams = {}) {
        return new Promise(res => {
            node.active = true
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
     * @param distance 距离,默认为null,会计算Math.max(cc.winSize.width, cc.winSize.height)
     * @param params 
     * @static
     */
    static in_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            G.check_widget(node)
            if (!distance) {
                distance = Math.max(cc.winSize.width, cc.winSize.height)
            }
            const start_position = node.position.add(C.DIRECTION_VEC2[direction].mul(distance))
            const end_postion = node.position
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
    static out_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            if (!distance) {
                distance = Math.max(cc.winSize.width, cc.winSize.height)
            }
            const end_postion = node.position.add(C.DIRECTION_VEC2[direction].mul(distance))
            node.active = true
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
    static in_fade_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            G.check_widget(node)
            const start_position = node.position.add(C.DIRECTION_VEC2[direction].mul(distance || C.FADE_MOVE_DISTANCE))
            const end_position = node.position
            node.position = start_position
            node.opacity = C.FADE_0
            node.active = true
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
    static out_fade_move(node: cc.Node, direction: keyof typeof DIRECTION, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            const end_position = node.position.add(C.DIRECTION_VEC2[direction].mul(distance || C.FADE_MOVE_DISTANCE))
            node.active = true
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