import { FLog } from "./FLog";
import { G } from "./G";

const C = {
    PATH: "panel",
    TIME: 0.3,
    EASE_IN: "linear" as cc.tweenEasing,
    EASE_OUT: "linear" as cc.tweenEasing,
    NODE_UI_STATE_DATA_SAVE_KEY: "ui-state-data",   // ui节点保存state数据的存储key,需要存储在相应的node上,注意避免冲突
}

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

    type Overwrite<T, U> = { [P in Exclude<keyof T, keyof U>]: T[P] } & U;

    /**
     * 设置panel的上下文信息,包括一些默认值
     * @param context
     */
    export function set_panel_context<T extends DataPanelContext>(context: T): T {
        if (!context.z_index_base) { context.z_index_base = 0 }
        context.state = "close"
        return context
    }

    let parent: cc.Node = null      // 父节点
    let now_z_index: number = 0     // 当前的zindex

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
            panel.context.prefab = await G.load_res(`${C.PATH}/${panel.context.path}`, cc.Prefab)
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
     * 绑定节点的ui-state
     * @param node
     * @param state
     */
    export function bind_ui_state_data(node: cc.Node, state: { [K: string]: Partial<cc.Node> }) {
        node[C.NODE_UI_STATE_DATA_SAVE_KEY] = state
    }

    /**
     * 绑定ui-btn的点击事件
     * @param btn
     * @param event
     */
    export function bind_ui_btn_event(btn: cc.Button, event: Function) {
        btn.node.on("click", event)
    }

    /**
     * 直接设置节点的ui-state
     * @param node
     * @param key
     */
    export function set_ui(node: cc.Node, key: string) {
        try {
            cc.tween(node).set(node[C.NODE_UI_STATE_DATA_SAVE_KEY][key]).start()
        } catch (error) {
            FLog.warn(`anima-ui-error,node=${node},key=${key}`)
        }
    }

    /**
     * 通过动画改变节点的ui-state
     * @param node
     * @param params
     */
    export async function anima_ui(node: cc.Node, params: {
        key: string,            // ui-state-key
        time?: number;          // 时间
        delay?: number;         // 延迟
        ease?: cc.tweenEasing;  // ease函数
    }) {
        try {
            await new Promise(res => {
                cc.tween(node)
                    .delay(params.delay || 0)
                    .to(params.time || C.TIME, node[C.NODE_UI_STATE_DATA_SAVE_KEY][params.key], { easing: params.ease || C.EASE_IN })
                    .call(res)
                    .start()
            })
        } catch (error) {
            FLog.warn(`anima-ui-error,node=${node},params=${params}`)
        }

    }

}
