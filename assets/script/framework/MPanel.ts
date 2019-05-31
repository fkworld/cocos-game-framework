import { G } from "./G";
import { MLog } from "./MLog";
import { MVersion } from "./MVersion";

const C = {
    BASE_PATH: "panel",
    TIME: 0.3,
    EASE_IN: cc.easeCubicActionOut(),
    EASE_OUT: cc.easeCubicActionIn(),
    DIRECTION: {
        "left": cc.v2(-1, 0),
        "right": cc.v2(1, 0),
        "up": cc.v2(0, 1),
        "down": cc.v2(0, -1),
        "left_up": cc.v2(-1, 1),
        "left_down": cc.v2(-1, -1),
        "right_up": cc.v2(1, 1),
        "right_down": cc.v2(1, -1),
    },
    SCALE_0: 0.01,                  // 某些组件在scale=0时会出现异常,因此将初始值设为0.01
    SCALE_1: 1,
    FADE_0: 1,                      // 某些组件在opacity=0时会出现异常,因此将初始值设为1
    FADE_1: 255,
    FADE_MOVE_DISTANCE: 100,        // 在fade-move模式下的移动距离
    FADE_SCALE_TARGET: 2,           // 在fade-scale模式下的目标scale
}

/** 方向类型 */
type TypeDirection = keyof typeof C.DIRECTION;
/** 打开方式类型;single-不允许再次打开;cover-再次打开时覆盖;chain-再次打开时会加入chain */
type TypeOpen = "single" | "cover" | "chain";
/** 动作的基础参数 */
interface ActionParams {
    time?: number;      // 时间
    delay?: number;     // 延迟
    ease?: any;         // ease函数
}
/** panel-config,panel配置 */
interface PanelConfig {
    path: string;       // 资源路径;同时也作为唯一key使用
    type: TypeOpen;     //打开方式
}
/** panel-instance,panel实例 */
interface PanelInstance {
    prefab: cc.Prefab;  // 对应的prefab
    node: cc.Node;      // 实例node,单个
    cmd: object[];      // 命令集合
}

/** 装饰器函数,panel配置参数;装饰器的设置会覆盖内部设置 */
export const MPanelConfig = (path: string, type?: TypeOpen) => {
    return (constructor: typeof MPanelExtends) => {
        // 特别注意,由于js中原型继承的bug,这里的config必须创建新的object而不是修改
        constructor.CONFIG = {
            path: path || "",
            type: type || "single",
        }
        // 注意,冻结之后在严格模式下会报错,在非严格模式下会跳过;cocos脚本运行方式为严格模式
        Object.freeze(constructor.CONFIG)
    }
}

/** 每个子panel的抽象类;需要继承 */
export abstract class MPanelExtends extends cc.Component {
    /** panel的配置参数 */
    static CONFIG: PanelConfig;
    /** 打开界面的参数结构;只需要给定类型即可,不需要赋值 */
    static OPEN_PARAMS: object;
    /** 关闭界面的参数结构;只需要给定类型即可,不需要赋值 */
    static CLOSE_PARAMS: object;
    /** panel-open-process */
    async on_open(params: object) { };
    /** panel-close-process */
    async on_close(params: object) { };
}

/**
 * [M] 游戏窗口管理
 * - 封装窗口打开的open/close接口,API为open/close
 * - 封装窗口中UI打开的in/out接口,API为in/out+type
 * - [注意] 未来可能需要调整并增加node.stopAllActions()
 * - [注意] 目前仅支持同种窗口单个单个显示
 * - [注意] 需要在AppMain中实例化,需要传入parent-node
 */
export class MPanel {

    private static ins: MPanel;

    static init(parent_node: cc.Node) {
        G.check_ins(MPanel)
        MPanel.ins = new MPanel()
        MPanel.ins.parent = parent_node
        MPanel.ins.now_z_index = 0
    }

    //////////
    // 配置的默认数值
    //////////

    static get TIME() { return C.TIME }
    static get EASE_IN() { return C.EASE_IN }
    static get EASE_OUT() { return C.EASE_OUT }

    //////////
    // 具体实现
    //////////

    /** 挂载父节点 */
    private parent: cc.Node;

    /** 当前的渲染层级 */
    private now_z_index: number;

    /** panel-实例的map结构存储;包括prefab,node,cmd */
    private map_ins: Map<string, PanelInstance> = new Map()

    //////////
    // 向外暴露两个静态的open和close方法供调用
    //////////

    /**
     * 打开panel
     * @param panel 传入panel的类型
     * @param params
     */
    static async open<T extends typeof MPanelExtends>(panel: T, params: T["OPEN_PARAMS"]) {
        // 判定是否配置了panel-config
        if (!panel.CONFIG) {
            MLog.error(`@MPanel, panel-config不存在, name=${panel.name}`)
            return
        }
        // 判断在编辑器模式下PATH是否包含name,仅在编辑器模式下;打包后会压缩代码,name会被丢弃
        if (MVersion.run_editor && panel.CONFIG.path.includes(panel.name)) {
            MLog.error(`@MPanel, panel-config-path错误, name=${panel.name}`)
        }
        // 获取key,value,z_index;考虑异步延迟,需要提前获取
        let key = panel.CONFIG.path
        let value = MPanel.ins.map_ins.get(key) || { prefab: null, node: null, cmd: [] }
        let z_index = MPanel.ins.now_z_index += 1
        // 获取同名节点进行预处理
        switch (panel.CONFIG.type) {
            case "single":
                if (value.node) { return }
                break;
            case "cover":
                if (value.node) { value.node.destroy() }
                break;
            case "chain":
                if (value.node) { value.cmd.push(params); return }
                break;
            default: break;
        }
        // 载入prefab
        let prefab = value.prefab || await G.load_res(`${C.BASE_PATH}/${key}`, cc.Prefab)
        // 需要载入的prefab并不存在时,输出log并return;注意name属性在打包后(或者代码混淆后)不可用
        if (!prefab) {
            MLog.error(`@MPanel: panel-prefab不存在, name=${panel.name}, path=${key}`)
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
     */
    static async close<T extends typeof MPanelExtends>(panel: T, params: T["CLOSE_PARAMS"]) {
        // 获取key,value
        let key = panel.CONFIG.path;
        let value = MPanel.ins.map_ins.get(key) || { prefab: null, node: null, cmd: [] }
        // 如果node实例不存在,则输出log并返回
        if (!value.node) {
            MLog.error(`@MPanel: panel-node不存在, name=${panel.name}, path=${key}`)
            return
        }
        // 执行节点关闭动画
        let panel_script = value.node.getComponent(panel)
        panel_script && await panel_script.on_close(params)
        value.node.destroy()
        // 打开下一个窗口
        if (panel.CONFIG.type === "chain") {
            let cmd = value.cmd.shift()
            if (cmd) {
                this.open(panel, cmd) // 注意此处没有await
            }
        }
        // 重新保存value
        value.node = null
        // this.map_ins.set(key, value)
    }

    //////////
    // UI方法
    // 1. 获取初始值和终点值
    // 2. 设定初始值
    // 3. 通过动画到达终点值,抛出res()
    //////////

    /** 
     * 直接进入
     * @param node
     */
    static in_nothing(node: cc.Node) {
        node.active = true
    }

    /** 
     * 直接离开
     * @param node
     */
    static out_nothing(node: cc.Node) {
        node.active = false
    }

    /**
     * 以scale形式进入;初始值为0,终点值为1
     * @param node 
     * @param params 
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
     * 以scale形式离开;初始值为当前值,终点值为0
     * @param node 
     * @param params 
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
     * 以fade形式进入;初始值为0,终点值为1
     * @param node 
     * @param params 
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
     * 以fade形式离开;初始值为当前值,终点值为0
     * @param node 
     * @param params 
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
     * 以move形式进入;终点值为当前位置,初始值根据direction和distance计算
     * @param node 
     * @param direction 方向
     * @param distance 距离,默认为null,会计算Math.max(cc.winSize.width, cc.winSize.height)
     * @param params 
     */
    static in_move(node: cc.Node, direction: TypeDirection, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            G.check_widget(node)
            distance = distance || Math.max(cc.winSize.width, cc.winSize.height)
            let start_position = node.position.add(C.DIRECTION[direction].mul(distance))
            let end_postion = node.position
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
     * 以move形式离开;初始值为当前位置,终点值根据direction和distance计算
     * @param node 
     * @param direction 
     * @param time 
     * @param ease 
     */
    static out_move(node: cc.Node, direction: TypeDirection, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            distance = distance || Math.max(cc.winSize.width, cc.winSize.height)
            let end_postion = node.position.add(C.DIRECTION[direction].mul(distance))
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay || 0),
                cc.moveTo(params.time || C.TIME, end_postion).easing(params.ease || C.EASE_OUT),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以fade+move形式组合进入
     * @param node 
     * @param direction 
     * @param distance 
     * @param params 
     */
    static in_fade_move(node: cc.Node, direction: TypeDirection, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            G.check_widget(node)
            distance = distance || C.FADE_MOVE_DISTANCE
            let start_position = node.position.add(C.DIRECTION[direction].mul(distance))
            let end_position = node.position
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
     * 以fade+move形式组合离开
     * @param node 
     * @param direction 
     * @param distance 
     * @param params 
     */
    static out_fade_move(node: cc.Node, direction: TypeDirection, distance: number = null, params: ActionParams = {}) {
        return new Promise(res => {
            distance = distance || C.FADE_MOVE_DISTANCE
            let end_position = node.position.add(C.DIRECTION[direction].mul(distance))
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