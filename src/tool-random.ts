/**
 * 工具函数模块
 * - 与随机数相关的函数
 */

/**
 * 获取一个随机值
 * @param min
 * @param max
 * @param floating 为true则表示返回整数，默认为false
 * @deprecated 建议使用lodash.random代替
 */
export function random(min: number, max: number, floating: boolean = false) {
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
 * @param array
 * @deprecated 建议使用lodash.sample代替
 */
export function random_array_item<T>(array: Array<T>): T {
  return array[Math.trunc(Math.random() * array.length)];
}

/**
 * 根据概率数组获取随机index
 * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
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
 * @param prob
 */
export function is_prob(prob: number) {
  return Math.random() <= prob;
}

/**
 * 随机位置
 * @param r
 */
export function random_position(r: number) {
  return cc.v3(random(-r, r, true), random(-r, r, true));
}
