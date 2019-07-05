import { G } from "./f-global";
import { FMLog } from "./fm-log";
import { FMVersion } from "./fm-version";

const C = {
    BASE_PATH: "panel",
}

/** 打开方式类型;single-不允许再次打开;cover-再次打开时覆盖; */
type TypeOpen = "single" | "cover";
/** panel的open参数类型 */
type ParamsPanelOpen<T extends typeof FMPanelExtends> = Parameters<T["prototype"]["on_open"]>[0] extends undefined ? {} : Parameters<T["prototype"]["on_open"]>[0];
/** panel的close参数类型 */
type ParamsPanelClose<T extends typeof FMPanelExtends> = Parameters<T["prototype"]["on_close"]>[0] extends undefined ? {} : Parameters<T["prototype"]["on_close"]>[0];
/** panel-config,panel配置 */
interface DataPanelConfig {
    path: string;       // 资源路径;同时也作为唯一key使用
    type: TypeOpen;     // 打开方式
}
/** panel-instance,panel实例 */
interface DataPanelInstance {
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
export const fm_panel_config = (path: string, type?: TypeOpen) => {
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
    static CONFIG: DataPanelConfig;
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
    static async open<T extends typeof FMPanelExtends>(panel: T, param: ParamsPanelOpen<T>) {
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
    static async close<T extends typeof FMPanelExtends>(panel: T, param: ParamsPanelClose<T>) {
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
    // 具体实现
    //////////

    /** 挂载父节点 */
    private parent: cc.Node;
    /** 当前的渲染层级 */
    private now_z_index: number;
    /** panel-实例的map结构存储;包括prefab,node,cmd */
    private map_ins: Map<string, DataPanelInstance> = new Map()

    /**
     * 获取panel的instance,如果不存在,则初始化
     * @param panel 
     */
    private get_panel_instance(panel: typeof FMPanelExtends): DataPanelInstance {
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
        if (FMVersion.is_preview() && !panel.CONFIG.path.includes(panel.name)) {
            FMLog.error(`@FMPanel, panel-config-path错误, name=${panel.name}`)
        }
        return true
    }

}