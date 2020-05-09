import { FState } from "./FState";
/**
 * 界面模块
 * - 【注意】需要在 App 中实例化，传入 parent-node
 * - 【设计要求】在设计上要求单个界面只允许存在一个实例；如果有需要打开多个的界面，可以转化为界面下打开多个组件
 * - 【注意】考虑2.3.2版本在android平台上，setParent()方法和setActive()方法均有很大的性能问题，所以这里保留2种实现方式
 */
export declare namespace FPanel {
    /** 界面类型：创建新的，使用旧的 */
    type PanelType = "new" | "old";
    /** 节点状态：打开，关闭 */
    type PanelState = "open" | "close";
    /** 界面脚本的实现基类 */
    export abstract class PanelBase extends cc.Component {
        /** 界面的上下文信息 */
        static context: {
            path: string;
            z_index_base: number;
            prefab: cc.Prefab;
            ins: PanelBase;
            type: PanelType;
            state: FState.SFSM<PanelState>;
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
    export const SetPanelContext: (path: string, type?: string, z_index_base?: number) => (constructor: typeof PanelBase) => void;
    /**
     * 初始化系统，传入父节点
     * @param node
     */
    export const init: (node: cc.Node) => void;
    /**
     * 打开页面
     * @param panel
     * @param params
     */
    export const open: <T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_open"]>) => Promise<void>;
    /**
     * 关闭页面
     * @param panel
     * @param params
     */
    export const close: <T extends typeof PanelBase>(panel: T, ...params: Parameters<T["prototype"]["on_close"]>) => Promise<void>;
    export {};
}
