/**
 * 简单节点动画
 */
export declare namespace SimpleNodeAnima {
    /**
     * 设置节点的状态信息
     * @param node
     * @param state
     */
    const set_all: (node: cc.Node, init_state: string, states: {
        [key: string]: Partial<cc.Node>;
    }) => void;
    /**
     * 无动画，直接至某个节点为某个状态
     * @param node
     * @param to
     */
    const no_anima: (node: cc.Node, to: string) => void;
    /**
     * 动画：从目前状态通过动画迁移到目标状态
     * @param node
     * @param to 目标状态的key
     * @param params 动画参数
     */
    const anima: (node: cc.Node, to: string, params: {
        time?: number;
        delay?: number;
        ease?: cc.tweenEasing;
    }) => Promise<void>;
}
