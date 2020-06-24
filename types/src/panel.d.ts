/**
 * 界面模块
 * - 需要在运行时初始化，传入父节点
 * @see https://www.yuque.com/fengyong/game-develop-road/olfgzo
 */
/** 界面类型 */
declare enum PanelType {
    /** 新创建一个页面 */
    New = 0,
    /** 寻找旧页面，node.active=true */
    Old = 1
}
/** 节点状态 */
declare enum PanelState {
    /** 打开状态 */
    Open = 0,
    /** 关闭状态 */
    Close = 1
}
interface PanelContext {
    /** prefab 的路径 */
    path: string;
    /** zindex 的基础值 */
    z_index_base: number;
    /** prefab */
    prefab: cc.Prefab;
    /** 示例 */
    ins: PanelBase;
    /** 类别 */
    type: PanelType;
    /** 当前状态 */
    state: PanelState;
}
/** 界面脚本的实现基类
 * @since 1.0.0
 * @example
  &#64;DE_SET_PANEL_CONTEXT("PanelExample", "Old", 0)
  export class PanelExample extends PanelBase {
    async on_create(): Promise<void> {}
    async on_open(): Promise<void> {}
    async on_close(): Promise<void> {}
  }
 */
export declare abstract class PanelBase extends cc.Component {
    /** 界面的上下文信息 */
    static context: PanelContext;
    /** 界面首次打开执行函数，处理只执行1次的逻辑，比如创建 */
    abstract on_create(): Promise<void>;
    /** 界面打开函数，处理动画和逻辑，会在onLoad之后，start之前执行 */
    abstract on_open(...params: unknown[]): Promise<void>;
    /** 界面关闭函数，处理动画和逻辑，会在onDestroy之前执行 */
    abstract on_close(...params: unknown[]): Promise<void>;
}
/**
 * 设置panel类上下文的装饰器
 * @since 1.0.0
 * @param config
 */
export declare function DE_SET_PANEL_CONTEXT(path: string, type?: keyof typeof PanelType, z_index_base?: number): (constructor: typeof PanelBase) => void;
/**
 * 初始化系统，传入父节点
 * @since 1.0.0
 * @param node
 */
export declare function _init_panel(node?: cc.Node): void;
/**
 * 预载入界面prefab
 * @since 1.0.0
 * @param panel
 */
export declare function pre_panel(panel: typeof PanelBase): Promise<void>;
/**
 * 打开页面
 * @since 1.0.0
 * @param panel
 * @param params
 */
export declare function open_panel<T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_open"]>): Promise<void>;
/**
 * 关闭页面
 * @since 1.0.0
 * @param panel
 * @param params
 */
export declare function close_panel<T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_close"]>): Promise<void>;
export {};
