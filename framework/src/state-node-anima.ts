/**
 * 简单节点动画
 */
export namespace SimpleNodeAnima {
  /** 保存在 node 上的 key */
  const SAVE_KEY = Symbol();

  /**
   * 设置节点的状态信息
   * @param node
   * @param state
   */
  export const set_all = (
    node: cc.Node,
    init_state: string,
    states: { [key: string]: Partial<cc.Node> }
  ) => {
    node[SAVE_KEY] = states;
    init_state && no_anima(node, init_state);
  };

  /**
   * 无动画，直接至某个节点为某个状态
   * @param node
   * @param to
   */
  export const no_anima = (node: cc.Node, to: string) => {
    cc.tween(node).set(node[SAVE_KEY][to]).start();
  };

  /**
   * 动画：从目前状态通过动画迁移到目标状态
   * @param node
   * @param to 目标状态的key
   * @param params 动画参数
   */
  export const anima = async (
    node: cc.Node,
    to: string,
    params: {
      time?: number; // 时间，默认为0.3
      delay?: number; // 延迟，默认为0
      ease?: cc.tweenEasing; // ease函数，默认为linear
    }
  ) => {
    params.time = params.time ?? 0.3;
    params.delay = params.delay ?? 0;
    params.ease = params.ease ?? "linear";
    await new Promise(res => {
      cc.tween(node)
        .delay(params.delay)
        .to(params.time, node[SAVE_KEY][to], { easing: params.ease })
        .call(res)
        .start();
    });
  };
}
