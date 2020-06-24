/** 其他信息 */
interface Other {
    /** 当前状态 */
    now: string;
    /** 动画时间 */
    time?: number;
    /** 动画延迟 */
    delay?: number;
    /** 动画ease函数 */
    ease?: cc.TweenEasing;
}
/**
 * 设置节点的状态信息
 * @since 1.0.0
 * @param node
 * @param states
 * @param others
 * @example
 * let n = new cc.Node();
 * let states = { show: { width: 100 }, hide: { width: 0 } };
 * let others = { now: "hide" };
 * set_node_anima(n, states, others);
 */
export declare function set_node_anima(node: cc.Node, states: {
    [key: string]: Partial<cc.Node>;
}, others: Other): void;
/**
 * 获取当前的节点动画状态
 * @since 1.0.0
 * @param node
 */
export declare function get_node_anima_now(node: cc.Node): string;
/**
 * 无动画，直接修改某个节点为某个状态
 * @since 1.0.0
 * @param node
 * @param target
 * @example
 * let n = new cc.Node();
 * set_node_anima(n, { show: { width: 100 }, hide: { width: 0 } }, { now: "hide" });
 * node_anima_not(n, "show");
 */
export declare function node_anima_not(node: cc.Node, target: string): void;
/**
 * 有动画，通过简单的动画效果修改某个节点为某个状态
 * @since 1.0.0
 * @param node
 * @param target
 * @param params 动画参数
 * @example
 * let n = new cc.Node();
 * set_node_anima(n, { show: { width: 100 }, hide: { width: 0 } }, { now: "hide" });
 * node_anima(n, "show");
 */
export declare function node_anima(node: cc.Node, target: string, params?: Omit<Other, "now">): Promise<void>;
export {};
