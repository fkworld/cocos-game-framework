/**
 * 简单节点动画
 */
export declare namespace SimpleNodeAnima {
    /** 动画参数 */
    interface ParamAnima {
        time?: number;
        delay?: number;
        ease?: cc.TweenEasing;
    }
    /**
     * 设置节点的状态信息
     * @param node
     * @param init_state
     * @param states
     */
    export function set_all(node: cc.Node, init_state: string, states: {
        [key: string]: Partial<cc.Node>;
    }): void;
    /**
     * 获取当前的节点动画状态
     * @param node
     */
    export function get_now(node: cc.Node): any;
    /**
     * 无动画，直接至某个节点为某个状态
     * @param node
     * @param to
     */
    export function no_anima(node: cc.Node, to: string): void;
    /**
     * 动画：从目前状态通过动画迁移到目标状态
     * @param node
     * @param to 目标状态的key
     * @param params 动画参数
     */
    export function anima(node: cc.Node, to: string, params: ParamAnima): Promise<void>;
    export {};
}
