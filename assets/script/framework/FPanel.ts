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
    type PanelState = "prepare" | "ok" | "error" | "open" | "close"

    /** 界面脚本的实现基类 */
    export abstract class PanelBase extends cc.Component {

        /** 界面的上下文信息 */
        static context: {
            // prefab的路径
            path: string
            // zindex的基础值,默认为0
            z_index_base: number
            // prefab
            prefab: cc.Prefab
            // 当前状态
            state: FState.StateJumpTable<PanelState>
            // 当前节点下挂载的脚本
            ins: PanelBase;
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
                state: new FState.StateJumpTable<PanelState>({
                    "prepare": ["ok", "error"],
                    "ok": ["open"],
                    "error": [],
                    "open": ["close"],
                    "close": ["open"],
                }, "prepare"),
                ins: null,
            }
            // 非编辑器模式下，载入 prefab
            !CC_EDITOR && FTool.load_res(constructor.context.path, cc.Prefab).then(v => {
                constructor.context.prefab = v
                constructor.context.state.try_change_state("ok")
            })
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
     * - 暂时没有使用到
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
        // 暂时更换了载入方式，所以这些是不需要的
        // 载入
        // await load(panel)
        // 二次校验,如果载入完成后,panel状态已经不为open,则跳过创建
        // if (!panel.context.state.try_change_state("open")) { return }
        let node = cc.instantiate(panel.context.prefab)
        node.parent = parent
        node.position = cc.Vec2.ZERO
        node.width = cc.winSize.width
        node.height = cc.winSize.height
        node.zIndex = z_index + panel.context.z_index_base
        node.active = true
        // 保存
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
