import { G } from "./f-global";
import { FMLog } from "./fm-log";
import { FMVersion } from "./fm-version";

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
/** 打开方式类型;single-不允许再次打开;cover-再次打开时覆盖; */
type TypeOpen = "single" | "cover";
/** panel的open参数类型 */
type TypePanelOpen<T extends typeof FMPanelExtends> = Parameters<T["prototype"]["on_open"]>[0] extends undefined ? object : Parameters<T["prototype"]["on_open"]>[0];
/** panel的close参数类型 */
type TypePanelClose<T extends typeof FMPanelExtends> = Parameters<T["prototype"]["on_close"]>[0] extends undefined ? object : Parameters<T["prototype"]["on_close"]>[0];
/** 动作的基础参数 */
interface ParamAction {
    time?: number;      // 时间
    delay?: number;     // 延迟
    ease?: any;         // ease函数
}
/** panel-config,panel配置 */
interface PanelConfig {
    path: string;       // 资源路径;同时也作为唯一key使用
    type: TypeOpen;     // 打开方式
}
/** panel-instance,panel实例 */
interface PanelInstance {
    // 静态部分
    prefab?: cc.Prefab;         // prefab
    is_check?: boolean;         // 是否通过check
    // 数据部分
    state?: "open" | "close";   // 当前的数据状态
    params_open?: object;       // 打开参数
    params_close?: object;      // 关闭参数
    z_index?: number;           // open时设定的node-z-index
    // 实例部分
    node?: cc.Node;             // 实例节点
}

/** 装饰器函数,panel配置参数;装饰器的设置会覆盖内部设置 */
export const FMPanelConfig = (path: string, type?: TypeOpen) => {
    return (constructor: typeof FMPanelExtends) => {
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
export abstract class FMPanelExtends extends cc.Component {
    /** panel的配置参数 */
    static CONFIG: PanelConfig;
    /** panel-open-process */
    async on_open(param?: object) { };
    /** panel-close-process */
    async on_close(param?: object) { };
}

/**
 * [M] 游戏窗口管理
 * - 封装窗口打开的open/close接口,API为open/close
 * - 封装窗口中UI打开的in/out接口,API为in/out+type
 * - [注意] 未来可能需要调整并增加node.stopAllActions()
 * - [注意] 目前仅支持同种窗口单个单个显示
 * - [注意] 需要在AppMain中实例化,需要传入parent-node
 */
export class FMPanel {

    private static ins: FMPanel;

    static init(parent_node: cc.Node) {
        G.check_ins(FMPanel)
        FMPanel.ins = new FMPanel()
        FMPanel.ins.parent = parent_node
        FMPanel.ins.now_z_index = 0
    }

    //////////
    // 向外暴露两个静态的open和close方法供调用
    //////////

    /**
     * 预载入界面,先读取界面的prefab
     * @param panel 
     */
    static async load(panel: typeof FMPanelExtends): Promise<void> {
        let value = FMPanel.ins.get_panel_instance(panel)
        value.prefab = value.prefab || await G.load_res(`${C.BASE_PATH}/${panel.CONFIG.path}`, cc.Prefab)
    }

    /**
     * 获取panel的实例脚本
     * @param panel 
     */
    static get_panel(panel: typeof FMPanelExtends): FMPanelExtends {
        let value = FMPanel.ins.get_panel_instance(panel)
        if (value.state === "open" && value.node) {
            return value.node.getComponent(panel)
        }
    }

    /**
     * 打开panel,写入cmd并执行cmd
     * @param panel 传入panel的类型
     * @param param
     */
    static async open<T extends typeof FMPanelExtends>(panel: T, param: TypePanelOpen<T>) {
        let value = FMPanel.ins.get_panel_instance(panel)
        // 如果状态为open,则根据panel-config-type执行不同逻辑
        if (value.state === "open") {
            FMLog.warn(`@mpanel: panel-state=open, 拦截处理, name=${panel.name}`)
            switch (panel.CONFIG.type) {
                // single:直接return
                default: case "single": return;
                // cover:如果节点已经创建,则删除节点后新建;如果节点未创建,则跳过本次创建
                case "cover":
                    if (value.node) {
                        value.node.destroy()
                        break
                    } else {
                        return
                    }
            }
        }
        // 修改数据部分
        value.state = "open"
        value.params_open = param
        value.z_index = FMPanel.ins.now_z_index += 1
        // 创建实例部分
        value.prefab = value.prefab || await G.load_res(`${C.BASE_PATH}/${panel.CONFIG.path}`, cc.Prefab)
        if (!value.prefab) {
            FMLog.error(`@mpanel: panel-prefab不存在, name=${panel.name}, path=${panel.CONFIG.path}`)
            return
        }
        if (value.state != "open") {
            // 如果载入完prefab后state不为open,则跳过创建
            FMLog.warn(`@mpanel: panel-state已经为close, 表示还未打开即关闭, name=${panel.name}`)
            return
        }
        value.node = cc.instantiate(value.prefab)
        value.node.parent = FMPanel.ins.parent
        value.node.position = cc.Vec2.ZERO
        value.node.width = cc.winSize.width
        value.node.height = cc.winSize.height
        value.node.zIndex = value.z_index
        value.node.active = true
        value.node.getComponent(panel) && await value.node.getComponent(panel).on_open(value.params_open)
    }

    /**
     * 关闭panel
     * @param panel 传入panel的类型
     * @param param
     */
    static async close<T extends typeof FMPanelExtends>(panel: T, param: TypePanelClose<T>) {
        let value = FMPanel.ins.get_panel_instance(panel)
        // 如果状态已经为close,则跳过本次删除
        if (value.state === "close") {
            FMLog.warn(`@mpanel: panel-state=close, 跳过本次关闭`)
            return
        }
        // 更改数据部分
        value.state = "close"
        value.params_close = param
        // 更改实例部分
        if (value.node) {
            value.node.getComponent(panel) && await value.node.getComponent(panel).on_close(value.params_close)
            value.node.destroy()
            value.node = null
        }
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

    /**
     * 获取panel的instance,如果不存在,则初始化
     * @param panel 
     */
    private get_panel_instance(panel: typeof FMPanelExtends): PanelInstance {
        let key = panel.CONFIG.path
        let value = this.map_ins.get(key)
        if (!value) {
            value = {}
            this.map_ins.set(key, value)
        }
        if (!value.is_check) {
            value.is_check = this.check_panel(panel)
        }
        return value
    }

    /** 校验panel */
    private check_panel(panel: typeof FMPanelExtends): boolean {
        // 判断是否配置了panel-config
        if (!panel.CONFIG) {
            FMLog.error(`@FMPanel, panel-config不存在, name=${panel.name}`)
            return false
        }
        // 判断在编辑器模式下PATH是否包含name,仅在编辑器模式下;打包后会压缩代码,name会被丢弃
        if (FMVersion.is_preview && !panel.CONFIG.path.includes(panel.name)) {
            FMLog.error(`@FMPanel, panel-config-path错误, name=${panel.name}`)
        }
        return true
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
     * @param param 
     */
    static in_scale(node: cc.Node, param: ParamAction = {}) {
        return new Promise(res => {
            node.scale = C.SCALE_0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.scaleTo(param.time || C.TIME, C.SCALE_1).easing(param.ease || C.EASE_IN),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以scale形式离开;初始值为当前值,终点值为0
     * @param node 
     * @param param 
     */
    static out_scale(node: cc.Node, param: ParamAction = {}) {
        return new Promise(res => {
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.scaleTo(param.time || C.TIME, C.SCALE_0).easing(param.ease || C.EASE_OUT),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以fade形式进入;初始值为0,终点值为1
     * @param node 
     * @param param 
     */
    static in_fade(node: cc.Node, param: ParamAction = {}) {
        return new Promise(res => {
            node.opacity = C.FADE_0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.fadeIn(param.time || C.TIME).easing(param.ease || C.EASE_IN),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以fade形式离开;初始值为当前值,终点值为0
     * @param node 
     * @param param 
     */
    static out_fade(node: cc.Node, param: ParamAction = {}) {
        return new Promise(res => {
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.fadeOut(param.time || C.TIME).easing(param.ease || C.EASE_OUT),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以move形式进入;终点值为当前位置,初始值根据direction和distance计算
     * @param node 
     * @param direction 方向
     * @param distance 距离,默认为null,会计算Math.max(cc.winSize.width, cc.winSize.height)
     * @param param 
     */
    static in_move(node: cc.Node, direction: TypeDirection, distance: number = null, param: ParamAction = {}) {
        return new Promise(res => {
            G.check_widget(node)
            distance = distance || Math.max(cc.winSize.width, cc.winSize.height)
            let start_position = node.position.add(C.DIRECTION[direction].mul(distance))
            let end_postion = node.position
            node.position = start_position
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.moveTo(param.time || C.TIME, end_postion).easing(param.ease || C.EASE_IN),
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
    static out_move(node: cc.Node, direction: TypeDirection, distance: number = null, param: ParamAction = {}) {
        return new Promise(res => {
            distance = distance || Math.max(cc.winSize.width, cc.winSize.height)
            let end_postion = node.position.add(C.DIRECTION[direction].mul(distance))
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.moveTo(param.time || C.TIME, end_postion).easing(param.ease || C.EASE_OUT),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以fade+move形式组合进入
     * @param node 
     * @param direction 
     * @param distance 
     * @param param 
     */
    static in_fade_move(node: cc.Node, direction: TypeDirection, distance: number = null, param: ParamAction = {}) {
        return new Promise(res => {
            G.check_widget(node)
            distance = distance || C.FADE_MOVE_DISTANCE
            let start_position = node.position.add(C.DIRECTION[direction].mul(distance))
            let end_position = node.position
            node.position = start_position
            node.opacity = C.FADE_0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.spawn(
                    cc.fadeIn(param.time || C.TIME).easing(param.ease || C.EASE_IN),
                    cc.moveTo(param.time || C.TIME, end_position).easing(param.ease || C.EASE_IN),
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
     * @param param 
     */
    static out_fade_move(node: cc.Node, direction: TypeDirection, distance: number = null, param: ParamAction = {}) {
        return new Promise(res => {
            distance = distance || C.FADE_MOVE_DISTANCE
            let end_position = node.position.add(C.DIRECTION[direction].mul(distance))
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(param.delay || 0),
                cc.spawn(
                    cc.moveTo(param.time || C.TIME, end_position).easing(param.ease || C.EASE_IN),
                    cc.fadeOut(param.time || C.TIME).easing(param.ease || C.EASE_IN),
                ),
                cc.callFunc(res)
            ))
        })
    }
}