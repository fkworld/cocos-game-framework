/**
 * 简单节点动画
 */
export namespace SimpleNodeAnima {
  /** 动画参数 */
  interface ParamAnima {
    time?: number; // 时间，默认为 0.3
    delay?: number; // 延迟，默认为 0
    ease?: cc.TweenEasing; // ease 函数，默认为 linear
  }

  /** 保存在 node 上的状态存储 */
  const KEY_STATES = Symbol();

  /** 保存在 node 上的当前状态 */
  const KEY_STATE_NOW = Symbol();

  /**
   * 设置节点的状态信息
   * @param node
   * @param init_state
   * @param states
   */
  export const set_all = (
    node: cc.Node,
    init_state: string,
    states: { [key: string]: Partial<cc.Node> }
  ) => {
    node[KEY_STATES] = states;
    node[KEY_STATE_NOW] = init_state;
    no_anima(node, init_state);
  };

  /**
   * 获取当前的节点动画状态
   * @param node
   */
  export const get_now = (node: cc.Node) => node[KEY_STATE_NOW];

  /**
   * 无动画，直接至某个节点为某个状态
   * @param node
   * @param to
   */
  export const no_anima = (node: cc.Node, to: string) => {
    node[KEY_STATE_NOW] = to;
    cc.tween(node).set(node[KEY_STATES][to]).start();
  };

  /**
   * 动画：从目前状态通过动画迁移到目标状态
   * @param node
   * @param to 目标状态的key
   * @param params 动画参数
   */
  export const anima = async (node: cc.Node, to: string, params: ParamAnima) => {
    params.time = params.time ?? 0.3;
    params.delay = params.delay ?? 0;
    params.ease = params.ease ?? "linear";
    node[KEY_STATE_NOW] = to;
    await new Promise(res => {
      cc.tween(node)
        .delay(params.delay)
        .to(params.time, node[KEY_STATES][to], { easing: params.ease })
        .call(res)
        .start();
    });
  };
}
