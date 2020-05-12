// 界面模块

import { load_res } from "./share";
import { SFSM } from "./state";

/** 界面类型：创建新的，使用旧的 */
type PanelType = "new" | "old"

/** 节点状态：打开，关闭 */
type PanelState = "open" | "close"

/** 父节点 */
let parent: cc.Node = null

/** 当前节点的zIndex */
let now_z_index: number = 0

/** 界面脚本的实现基类 */
export abstract class PanelBase extends cc.Component {
    /** 界面的上下文信息 */
    static context: {
        path: string                    // prefab的路径
        z_index_base: number            // zindex的基础值,默认为0
        prefab: cc.Prefab               // prefab
        ins: PanelBase                  // 实例
        type: PanelType                 // 种类
        state: SFSM<PanelState>  // 当前状态
    } = null
    /** 界面首次打开执行函数，处理只执行1次的逻辑，比如创建 */
    abstract async on_create(): Promise<void>
    /** 界面打开函数,处理动画和逻辑,会在onLoad之后,start之前执行 */
    abstract async on_open(...params: any[]): Promise<void>
    /** 界面关闭函数,处理动画和逻辑,会在onDestroy之前执行 */
    abstract async on_close(...params: any[]): Promise<void>
}

/**
 * 设置 panel 类上下文的装饰器
 * @param config
 */
export const DeSetPanelContext = (path: string, type = "old", z_index_base = 0) => {
    return (constructor: typeof PanelBase) => {
        constructor.context = {
            path: path,
            z_index_base: z_index_base,
            prefab: null,
            ins: null,
            type: type as PanelType,
            state: new SFSM<PanelState>({
                id: "PanelState",
                initial: "close",
                states: {
                    "open": ["close"],
                    "close": ["open"],
                },
            }),
        }
    }
}

/**
 * 初始化系统，传入父节点
 * @param node
 */
export const init_panel_runtime = (node: cc.Node) => {
    parent = node
}

/**
 * 获取界面实例，如果获取不到，则创建新的
 * @param panel
 */
const get_ins = async (panel: typeof PanelBase) => {
    if (!panel.context.prefab) {
        panel.context.prefab = await load_res(panel.context.path, cc.Prefab)
    }
    if (!panel.context.ins) {
        let node = cc.instantiate(panel.context.prefab)
        node.parent = parent
        node.position = cc.Vec3.ZERO
        node.width = cc.winSize.width
        node.height = cc.winSize.height
        panel.context.ins = node.getComponent(panel)
        await panel.context.ins.on_create()
    }
    return panel.context.ins
}

/**
 * 打开页面
 * @param panel
 * @param params
 */
export const open_panel = async <T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_open"]>) => {
    // 校验
    if (!panel.context.state.try_go_state("open")) { return }
    let z_index = now_z_index += 1
    // 载入
    let ins = await get_ins(panel)
    ins.node.zIndex = z_index + panel.context.z_index_base
    ins.node.active = true
    // 动画
    await panel.context.ins.on_open(...params)
}

/**
 * 关闭页面
 * @param panel
 * @param params
 */
export const close_panel = async <T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_close"]>) => {
    // 校验
    if (!panel.context.state.try_go_state("close")) { return }
    // 删除实例
    await panel.context.ins.on_close(...params)
    if (panel.context.type === "new") {
        panel.context.ins.node.destroy()
        panel.context.ins = null
    } else if (panel.context.type === "old") {
        panel.context.ins.node.active = false
    }
}
