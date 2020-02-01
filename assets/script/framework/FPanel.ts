import { FTool } from "./FTool";
import { FState } from "./FState";

/**
 * 界面模块
 * - *注意* 需要在 App 中实例化，传入 parent-node
 * - *设计要求* 在设计上要求单个界面只允许存在一个实例；如果有需要打开多个的界面，可以转化为界面下打开多个组件
 */
export namespace FPanel {

    /**
     * 界面的状态
     * - open 打开
     * - close 关闭
     */
    type PanelState = "open" | "close"

    /** 界面脚本的实现基类 */
    export abstract class PanelBase extends cc.Component {

        /** 界面的上下文信息 */
        static context: {
            path: string            // prefab的路径
            z_index_base: number    // zindex的基础值,默认为0
            prefab: cc.Prefab       // prefab
            ins: PanelBase          // 实例
            state: FState.StateJumpTable<PanelState>    // 当前状态
        } = null

        /** 界面打开函数,处理动画和逻辑,会在onLoad之后,start之前执行 */
        abstract async on_open(...params: any): Promise<void>;

        /** 界面关闭函数,处理动画和逻辑,会在onDestroy之前执行 */
        abstract async on_close(...params: any): Promise<void>;
    }

    /**
     * 设置 panel 类上下文的装饰器
     * @param config
     */
    export function SetPanelContext(config: {
        path: string,
        z_index_base?: number,
    }) {
        return (constructor: typeof PanelBase) => {
            constructor.context = {
                path: config.path,
                z_index_base: config.z_index_base || 0,
                prefab: null,
                ins: null,
                state: new FState.StateJumpTable<PanelState>({
                    "open": ["close"],
                    "close": ["open"],
                }, "close"),
            }
        }
    }

    /** 父节点 */
    let parent: cc.Node = null

    /** 当前的 zindex */
    let now_z_index: number = 0

    /**
     * 初始化系统，传入 parent-node
     * @param node
     */
    export function init_parent(node: cc.Node) {
        parent = node
    }

    /**
     * 载入界面的 prefab
     * @param panel
     */
    async function load(panel: typeof PanelBase) {
        if (!panel.context.prefab) {
            panel.context.prefab = await FTool.load_res(panel.context.path, cc.Prefab)
        }
    }

    /**
     * 打开页面
     * @param panel
     * @param params
     */
    export async function open<T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_open"]>) {
        // 校验
        if (!panel.context.state.try_change_state("open")) { return }
        let z_index = now_z_index += 1
        // 载入
        await load(panel)
        // 创建并保存
        let node = cc.instantiate(panel.context.prefab)
        node.parent = parent
        node.position = cc.Vec2.ZERO
        node.width = cc.winSize.width
        node.height = cc.winSize.height
        node.zIndex = z_index + panel.context.z_index_base
        node.active = true
        panel.context.ins = node.getComponent(panel)
        // 动画
        await panel.context.ins.on_open(...params)
    }

    /**
     * 关闭页面
     * @param panel
     * @param params
     */
    export async function close<T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_close"]>) {
        // 校验
        if (!panel.context.state.try_change_state("close")) { return }
        // 删除实例
        await panel.context.ins.on_close(...params)
        panel.context.ins.node.destroy()
        panel.context.ins = null
    }

}
