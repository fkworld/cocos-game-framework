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

/** 保存在node上的状态存储 */
const KEY_STATES = Symbol();
/** 保存在node上的其他信息存储 */
const KEY_OTHER = Symbol();

/** 获取node上的状态信息 */
function get_states_by_node(node: cc.Node): Partial<cc.Node> {
  return node[KEY_STATES];
}
/** 获取node上的其他信息 */
function get_others_by_node(node: cc.Node): Other {
  return node[KEY_OTHER];
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
export function set_node_anima(
  node: cc.Node,
  states: { [key: string]: Partial<cc.Node> },
  others: Other,
): void {
  node[KEY_STATES] = states;
  node[KEY_OTHER] = others;
  node_anima_not(node, others.now);
}

/**
 * 获取当前的节点动画状态
 * @since 1.0.0
 * @param node
 */
export function get_node_anima_now(node: cc.Node): string {
  return get_others_by_node(node).now;
}

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
export function node_anima_not(node: cc.Node, target: string): void {
  get_others_by_node(node).now = target;
  cc.tween(node).set(get_states_by_node(node)[target]).start();
}

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
export async function node_anima(
  node: cc.Node,
  target: string,
  params: Omit<Other, "now"> = {},
): Promise<void> {
  get_others_by_node(node).now = target;
  await new Promise(res => {
    cc.tween(node)
      .delay(params.delay ?? get_others_by_node(node).delay ?? 0)
      .to(params.time ?? get_others_by_node(node).time ?? 0.3, get_states_by_node(node)[target], {
        easing: params.ease ?? get_others_by_node(node).ease ?? "linear",
      })
      .call(res)
      .start();
  });
}
