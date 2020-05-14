/**
 * 获取一个随机值
 * @param min
 * @param max
 * @param floating 为true则表示返回整数，默认为false
 * @deprecated 建议使用lodash/random代替
 */
export declare const random: (min: number, max: number, floating?: boolean) => number;
/**
 * 获取一个随机数组项，概率相同
 * @param array
 * @deprecated 建议使用lodash/sample代替
 */
export declare const random_array_item: <T>(array: T[]) => T;
/**
 * 根据概率数组获取随机index
 * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
 * @param prob_array 概率数组
 */
export declare const random_prob: (prob_array: number[]) => number;
/**
 * 随机1次，判断是否满足给定概率
 * @param prob
 */
export declare const is_prob: (prob: number) => boolean;
/**
 * 随机位置
 * @param r
 */
export declare const random_position: (r: number) => cc.Vec3;
