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
export declare function random(min: number, max: number, floating?: boolean): number;
/**
 * 获取一个随机数组项，概率相同
 * @since 1.0.0
 * @deprecated 建议使用lodash.sample代替
 * @param array
 */
export declare function random_array_item<T>(array: Array<T>): T;
/**
 * 根据概率数组获取随机index
 * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
 * @since 1.0.0
 * @param prob_array 概率数组
 */
export declare function random_prob(prob_array: number[]): number;
/**
 * 随机1次，判断是否满足给定概率
 * @since 1.0.0
 * @param prob
 */
export declare function is_prob(prob: number): boolean;
/**
 * 随机位置
 * @since 1.0.0
 * @param r
 */
export declare function random_position(r: number): cc.Vec3;
/**
 * 求一个数的正数模
 * @since 1.0.0
 * @param n
 * @param mode
 */
export declare function get_positive_mode(n: number, mode: number): number;
/**
 * 等待n秒
 * @since 1.0.0
 * @param time 单位s
 */
export declare function do_delay(time: number): Promise<void>;
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
export declare function get_template_string(template: string, ...params: string[]): string;
export declare function is_string(x: unknown): x is string;
export declare function is_number(x: unknown): x is number;
export declare function is_boolean(x: unknown): x is boolean;
export declare function is_function(x: unknown): x is () => unknown;
export declare function is_object(x: unknown): x is Record<string, unknown>;
export declare function is_symbol(x: unknown): x is symbol;
export declare function is_bigint(x: unknown): x is bigint;
export declare function is_undefined(x: unknown): x is undefined;
export declare function is_array(x: unknown): x is Array<unknown>;
