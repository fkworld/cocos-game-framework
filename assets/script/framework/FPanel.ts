import { FLog } from "./FLog";
import { G } from "./G";

const C = {
    PATH: "panel",
    TIME: 0.3,
    EASE_IN: "linear" as cc.tweenEasing,
    EASE_OUT: "linear" as cc.tweenEasing,
}

/** panel的实例数据 */
interface DataPanelInstance {
    prefab?: cc.Prefab;         // prefab
    state?: "open" | "close";   // 当前状态(仅对单页面生效)
    node?: cc.Node;             // 当前节点(仅对单页面生效)
}
/** ui节点的状态数据 */
interface DataUIState {
    in_state: Partial<cc.Node>, // in-state的状态数据,表示在界面
    out_state: Partial<cc.Node>,// out-state的状态数据,表示不在界面
}
/** ui节点的状态转移过程动画参数 */
interface ParamsUIAnima {
    time?: number;          // 时间
    delay?: number;         // 延迟
    ease?: cc.tweenEasing;  // ease函数
}

/**
 * [framework] 游戏窗口管理
 * - [注意] 需要在AppMain中实例化,需要传入parent-node
 */
export namespace FPanel {

    export abstract class FPanelTemplate extends cc.Component {
        CONFIG: {
            path: string            // 资源路径;同时也作为唯一key使用
            is_multiple: boolean    // 是否允许打开多个
            type_open: object       // 打开参数
            type_close: object      // 关闭参数
        } = null;
        async on_open(params: typeof FPanelTemplate.prototype.CONFIG.type_open) { };
        async on_close(params: typeof FPanelTemplate.prototype.CONFIG.type_close) { };
    }

    let parent: cc.Node = null                                  // 父节点
    let now_z_index: number = 0                                 // 当前的zindex
    let panel_map: Map<string, DataPanelInstance> = new Map()   // 页面数据

    /** 初始化 */
    export function init_parent(node: cc.Node) {
        parent = node
    }

    /**
     * 获取页面数据
     * @param panel
     */
    export function get_panel(panel: typeof FPanelTemplate): DataPanelInstance {
        let key = panel.prototype.CONFIG.path
        let value = panel_map.get(key)
        if (!value) {
            value = {}
            panel_map.set(key, value)
        }
        return value
    }

    /** 载入界面的prefab */
    export async function load(panel: typeof FPanelTemplate) {
        let info = get_panel(panel)
        if (!info.prefab) {
            info.prefab = await G.load_res(`${C.PATH}/${panel.prototype.CONFIG.path}`, cc.Prefab)
        }
    }

    /**
     * 打开页面
     * @param panel
     * @param params
     */
    export async function open<T extends typeof FPanelTemplate>(panel: T, params: T["prototype"]["CONFIG"]["type_open"]) {
        let info = get_panel(panel)
        // 校验
        if (!panel.prototype.CONFIG.is_multiple && info.state === "open") {
            FLog.warn(`@FPanel: 逻辑错误,页面重复打开, panel=${panel.prototype.CONFIG.path}`)
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
        info.node = panel.prototype.CONFIG.is_multiple ? null : node;
        // 动画
        await node.getComponent(panel).on_open(params)
    }

    /**
     * 关闭页面
     * @param panel
     * @param params
     */
    export async function close<T extends typeof FPanelTemplate>(panel: T, params: T["prototype"]["CONFIG"]["type_close"]) {
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

    /** 设置ui节点的状态数据 */
    export function set_ui_state_data(node: cc.Node, in_state: Partial<cc.Node>, out_state: Partial<cc.Node>) {
        node["ui-data"] = { in_state: in_state, out_state: out_state } as DataUIState
    }

    /** 获取ui节点的状态数据 */
    export function get_ui_state_data(node: cc.Node): DataUIState {
        if (node["ui-data"]) {
            return node["ui-data"]
        } else {
            FLog.error("@FPanel-ui-data: 此ui节点并未绑定ui-state-data")
            return { in_state: {}, out_state: {} }
        }
    }

    /** ui节点变为in状态 */
    export async function in_ui(node: cc.Node, params: ParamsUIAnima) {
        await new Promise(res => {
            let ui_data = get_ui_state_data(node)
            cc.tween(node)
                .set(ui_data.out_state)
                .delay(params.delay || 0)
                .to(params.time || C.TIME, ui_data.in_state, { easing: params.ease || C.EASE_IN })
                .call(res)
                .start()
        })
    }

    /** ui节点变为out状态 */
    export async function out_ui(node: cc.Node, params: ParamsUIAnima) {
        await new Promise(res => {
            let ui_data = get_ui_state_data(node)
            cc.tween(node)
                .delay(params.delay || 0)
                .to(params.time || C.TIME, ui_data.out_state, { easing: params.ease || C.EASE_OUT })
                .call(res)
                .start()
        })
    }
}
