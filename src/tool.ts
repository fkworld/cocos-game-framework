/**
 * 工具函数模块
 * @see https://www.yuque.com/fengyong/game-develop-road/ah2ypi
 */

/**
 * 获取一个随机值
 * @since 1.0.0
 * @deprecated 建议使用lodash.random代替
 * @param min
 * @param max
 * @param floating 为true则表示返回整数，默认为false
 */
export function random(min: number, max: number, floating = false): number {
  if (floating) {
    return Math.random() * (max - min) + min;
  } else {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}

/**
 * 获取一个随机数组项，概率相同
 * @since 1.0.0
 * @deprecated 建议使用lodash.sample代替
 * @param array
 */
export function random_array_item<T>(array: Array<T>): T {
  return array[Math.trunc(Math.random() * array.length)];
}

/**
 * 根据概率数组获取随机index
 * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
 * @since 1.0.0
 * @param prob_array 概率数组
 */
export function random_prob(prob_array: number[]): number {
  // 获取随机数
  let r = Math.random();
  // 对概率数组的处理
  let s = prob_array
    .map((v, index) => {
      return { index: index, prob: v };
    })
    .sort((a, b) => a.prob - b.prob);
  // 判断随机位置
  let result = s.find(v => (r -= v.prob) <= 0);
  return result ? result.index : s.length - 1;
}

/**
 * 随机1次，判断是否满足给定概率
 * @since 1.0.0
 * @param prob
 */
export function is_prob(prob: number): boolean {
  return Math.random() <= prob;
}

/**
 * 随机位置
 * @since 1.0.0
 * @param r
 */
export function random_position(r: number): cc.Vec3 {
  return cc.v3(random(-r, r, true), random(-r, r, true));
}

/**
 * 求一个数的正数模
 * @since 1.0.0
 * @param n
 * @param mode
 */
export function get_positive_mode(n: number, mode: number): number {
  return ((n % mode) + mode) % mode;
}

/**
 * 等待n秒
 * @since 1.0.0
 * @param time 单位s
 */
export async function do_delay(time: number): Promise<void> {
  await new Promise(res => setTimeout(res, time * 1e3));
}

/**
 * 带参数的自定义模版字符串
 * @since 1.0.0
 * @param template 自定义模板字符串，使用{index}来表示参数，index表示参数序号
 * @param params 多个参数
 * @example
 * let template = "My name is {0}, my age is {1}, my sex is {2}."
 * let params = ["fy", "16"]
 * get_template_string(template, ...params)
 * // My name is fy, my age is 16, my sex is {2}.
 */
export function get_template_string(template: string, ...params: string[]): string {
  return template.replace(/{([0-9]+)}/g, (match, index) => params[index] ?? `{${index}}`);
}

export function is_string(x: unknown): x is string {
  return typeof x === "string";
}
export function is_number(x: unknown): x is number {
  return typeof x === "number";
}
export function is_boolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}
export function is_function(x: unknown): x is () => unknown {
  return typeof x === "function";
}
export function is_object(x: unknown): x is Record<string, unknown> {
  return typeof x === "object";
}
export function is_symbol(x: unknown): x is symbol {
  return typeof x === "symbol";
}
export function is_bigint(x: unknown): x is bigint {
  return typeof x === "bigint";
}
export function is_undefined(x: unknown): x is undefined {
  return typeof x === "undefined";
}
export function is_array(x: unknown): x is Array<unknown> {
  return x instanceof Array;
}
