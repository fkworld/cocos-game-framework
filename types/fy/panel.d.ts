import { SFSM } from "./state";
/** 界面类型：创建新的，使用旧的 */
declare type PanelType = "new" | "old";
/** 节点状态：打开，关闭 */
declare type PanelState = "open" | "close";
/** 界面脚本的实现基类 */
export declare abstract class PanelBase extends cc.Component {
    /** 界面的上下文信息 */
    static context: {
        path: string;
        z_index_base: number;
        prefab: cc.Prefab;
        ins: PanelBase;
        type: PanelType;
        state: SFSM<PanelState>;
    };
    /** 界面首次打开执行函数，处理只执行1次的逻辑，比如创建 */
    abstract on_create(): Promise<void>;
    /** 界面打开函数,处理动画和逻辑,会在onLoad之后,start之前执行 */
    abstract on_open(...params: any[]): Promise<void>;
    /** 界面关闭函数,处理动画和逻辑,会在onDestroy之前执行 */
    abstract on_close(...params: any[]): Promise<void>;
}
/**
 * 设置 panel 类上下文的装饰器
 * @param config
 */
export declare const DeSetPanelContext: (path: string, type?: string, z_index_base?: number) => (constructor: typeof PanelBase) => void;
/**
 * 初始化系统，传入父节点
 * @param node
 */
export declare const init_panel_runtime: (node: cc.Node) => void;
/**
 * 打开页面
 * @param panel
 * @param params
 */
export declare const open_panel: <T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_open"]>) => Promise<void>;
/**
 * 关闭页面
 * @param panel
 * @param params
 */
export declare const close_panel: <T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_close"]>) => Promise<void>;
export {};
