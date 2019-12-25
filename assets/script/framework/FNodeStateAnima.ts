/**
 * 节点状态动画模块
 * - 用于绑定节点状态信息，保存在 node 下。
 * - 通过传入动画参数，执行从一个状态到另一个状态的动画。
 */
export namespace FNodeStateAnima {

    /** 保存在 node 上的 key */
    const SAVE_KEY = Symbol()

    /**
     * 设置节点的状态信息
     * @param node
     * @param state
     */
    export function set_all(node: cc.Node, states: { [key: string]: Partial<cc.Node> }) {
        node[SAVE_KEY] = states
    }

    /**
     * 无动画，直接至某个节点为某个状态
     * @param node
     * @param to
     */
    export function no_anima(node: cc.Node, to: string) {
        try {
            cc.tween(node)
                .set(node[SAVE_KEY][to])
                .start()
        } catch{
            // TODO
        }
    }

    /**
     * 动画：从目前状态通过动画迁移到目标状态
     * @param node
     * @param to 目标状态的key
     * @param params 动画参数
     */
    export async function anima(node: cc.Node, to: string, params: {
        time?: number;          // 时间，默认为 0.3
        delay?: number;         // 延迟，默认为 0
        ease?: cc.tweenEasing;  // ease 函数，默认为 linear
    }) {
        try {
            if (params.time === undefined) { params.time = 0.3 }
            if (params.delay === undefined) { params.delay = 0 }
            if (params.ease === undefined) { params.ease = "linear" }
            await new Promise(res => {
                cc.tween(node)
                    .delay(params.delay)
                    .to(params.time, node[SAVE_KEY][to], { easing: params.ease })
                    .call(res)
                    .start()
            })
        } catch{
            // TODO
        }
    }
}
