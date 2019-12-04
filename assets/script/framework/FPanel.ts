import { FTool } from "./FTool";

/**
 * [framework] 游戏窗口管理
 * - [注意] 需要在App中实例化,需要传入parent-node
 * - [设计要求] 在设计上要求单个界面只允许存在一个实例;如果有需要打开多个的界面,可以转化为界面下打开多个组件
 */
export namespace FPanel {

    /** panel的上下文信息 */
    export interface DataPanelContext {
        readonly path: string           // prefab的路径
        readonly type_open: object      // 打开参数
        readonly type_close: object     // 关闭参数
        z_index_base?: number           // zindex的基础值,默认为0
        prefab?: cc.Prefab              // prefab
        state?: "open" | "close";       // 当前状态
        ins: FPanelTemplate;            // 当前节点下挂载的脚本
    }

    /**
     * 界面脚本的实现类
     * - 注意使用implements而不是extends,因为二者没有明显的父子关系
     */
    export abstract class FPanelTemplate extends cc.Component {

        /** 界面的上下文信息 */
        static context: DataPanelContext;

        /** 界面打开函数,处理动画和逻辑,会在onLoad之后,start之前执行 */
        abstract async on_open(params: object): Promise<void>;

        /** 界面关闭函数,处理动画和逻辑,会在onDestroy之前执行 */
        abstract async on_close(params: object): Promise<void>;
    }

    /**
     * 设置panel的上下文信息,包括一些默认值
     * @param context
     */
    export function set_panel_context<T extends DataPanelContext>(context: T): T {
        if (!context.z_index_base) { context.z_index_base = 0 }
        context.state = "close"
        return context
    }

    /** prefab的基础的父节点 */
    const PATH = "Panel"

    /** 父节点 */
    let parent: cc.Node = null

    /** 当前的zindex */
    let now_z_index: number = 0

    /**
     * 初始化系统,传入parent-node
     * @param node
     */
    export function init_parent(node: cc.Node) {
        parent = node
    }

    /**
     * 载入界面的prefab
     * @param panel
     */
    export async function load(panel: typeof FPanelTemplate) {
        if (!panel.context.prefab) {
            panel.context.prefab = await FTool.load_res(`${PATH}/${panel.context.path}`, cc.Prefab)
        }
    }

    /**
     * 打开页面
     * @param panel
     * @param params
     */
    export async function open<T extends typeof FPanelTemplate>(panel: T, params: T["context"]["type_open"]) {
        // 校验
        if (panel.context.state === "open") { return }
        panel.context.state = "open"
        let z_index = now_z_index += 1
        // 载入
        await load(panel)
        // 二次校验,如果载入完成后,panel状态已经不为open,则跳过创建
        if (panel.context.state != "open") { return }
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
        await panel.context.ins.on_open(params)
    }

    /**
     * 关闭页面
     * @param panel
     * @param params
     */
    export async function close<T extends typeof FPanelTemplate>(panel: T, params: T["context"]["type_close"]) {
        // 校验
        if (panel.context.state === "close") { return }
        if (!panel.context.ins) { return }
        panel.context.state = "close"
        // 删除实例
        await panel.context.ins.on_close(params)
        panel.context.ins.node.destroy()
        panel.context.ins = null
    }

    /**
     * 绑定ui-btn的点击事件
     * @param btn
     * @param event
     */
    export function bind_btn_event(btn: cc.Button, event: Function) {
        btn.node.on("click", event)
    }
}
