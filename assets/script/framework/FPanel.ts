import { FLog } from "./FLog";
import { G } from "./G";

const C = {
    PATH: "panel",
}

/** panel的open参数类型 */
type ParamsPanelOpen<T extends typeof FPanel.FPanelTemplate> = Parameters<T["prototype"]["on_open"]>[0] extends undefined ? {} : Parameters<T["prototype"]["on_open"]>[0];
/** panel的close参数类型 */
type ParamsPanelClose<T extends typeof FPanel.FPanelTemplate> = Parameters<T["prototype"]["on_close"]>[0] extends undefined ? {} : Parameters<T["prototype"]["on_close"]>[0];
/** panel-config,panel配置 */
interface DataPanelConfig {
    path: string;               // 资源路径;同时也作为唯一key使用
    is_multiple: boolean;       // 是否允许打开多个
}
/** panel的实例数据 */
interface DataPanelInstance {
    prefab?: cc.Prefab;         // prefab
    state?: "open" | "close";   // 当前状态(仅对单页面生效)
    node?: cc.Node;             // 当前节点(仅对单页面生效)
}

/**
 * [framework] 游戏窗口管理
 * - [注意] 需要在AppMain中实例化,需要传入parent-node
 */
export namespace FPanel {

    /** panel配置函数,仅用于panel类的装饰器 */
    export function config_panel(path: string, is_multiple = false) {
        return (constructor: typeof FPanelTemplate) => {
            // 特别注意,由于js中原型继承的bug,这里的config必须创建新的object而不是修改
            constructor.CONFIG = {
                path: path,
                is_multiple: is_multiple
            }
            // 冻结之后在严格模式下会报错,在非严格模式下会跳过;cocos脚本运行方式为严格模式
            Object.freeze(constructor.CONFIG)
        }
    }

    export abstract class FPanelTemplate extends cc.Component {
        static CONFIG: DataPanelConfig;
        async on_open(params: object) { };
        async on_close(params: object) { };
    }

    let parent: cc.Node = null                                  // 父节点
    let now_z_index: number = 0                                 // 当前的zindex
    let map_panel: Map<string, DataPanelInstance> = new Map()   // 页面数据

    /** 初始化 */
    export function init_parent(node: cc.Node) {
        parent = node
    }

    /**
     * 获取页面数据
     * @param panel
     */
    export function get_panel(panel: typeof FPanelTemplate): DataPanelInstance {
        let key = panel.CONFIG.path
        let value = map_panel.get(key)
        if (!value) {
            value = {}
            map_panel.set(key, value)
        }
        return value
    }

    /** 载入界面的prefab */
    export async function load(panel: typeof FPanelTemplate) {
        let info = get_panel(panel)
        if (!info.prefab) {
            info.prefab = await G.load_res(`${C.PATH}/${panel.CONFIG.path}`, cc.Prefab)
        }
    }

    /**
     * 打开页面
     * @param panel
     * @param params
     */
    export async function open<T extends typeof FPanelTemplate>(panel: T, params: ParamsPanelOpen<T>) {
        let info = get_panel(panel)
        // 校验
        if (!panel.CONFIG.is_multiple && info.state === "open") {
            FLog.warn(`@FPanel: 逻辑错误,页面重复打开, panel=${panel.CONFIG.path}`)
            return
        }
        // 修改数据
        info.state = "open"
        let z_index = now_z_index += 1
        // 载入+创建节点
        await load(panel)
        if (info.state != "open") { return } // 如果载入完成后,panel状态已经不为open,则跳过创建
        let node = cc.instantiate(info.prefab)
        node.parent = parent
        node.position = cc.Vec2.ZERO
        node.width = cc.winSize.width
        node.height = cc.winSize.height
        node.zIndex = z_index
        node.active = true
        // 保存
        info.node = panel.CONFIG.is_multiple ? null : node;
        // 动画
        await node.getComponent(panel).on_open(params)
    }

    /**
     * 关闭页面
     * @param panel
     * @param params
     */
    export async function close<T extends typeof FPanelTemplate>(panel: T, params: ParamsPanelClose<T>) {
        let info = get_panel(panel)
        // 校验
        if (info.state === "close") { return }
        if (!info.node) { return }
        // 修改数据
        info.state = "close"
        // 动画
        await info.node.getComponent(panel).on_close(params)
        // 删除节点
        info.node.destroy()
        info.node = null
    }

    /**
     * 关闭自身(无法传入参数)
     * @param self 一般在脚本中传入this即可
     */
    export async function close_self(self: FPanelTemplate) {
        await self.on_close({})
        self.node.destroy()
    }

}
