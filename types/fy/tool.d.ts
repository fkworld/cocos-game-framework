/** 输出log */
export declare const TAG = "@fy:";
/**
 * 求一个数的正数模
 * @param n
 * @param mode
 */
export declare const get_positive_mode: (n: number, mode: number) => number;
/**
 * 等待n秒
 * @param time 单位s
 */
export declare const do_delay: (time: number) => Promise<void>;
/**
 * 等待执行
 * @param f_do 执行函数
 * @param f_is 判定函数
 * @param wait_all 最高等待时间
 * @param wait_interval 等待间隔
 */
export declare const wait_for_do: (f_do: Function, f_is: Function, wait_all?: number, wait_interval?: number) => Promise<void>;
/**
 * 带参数的自定义模版字符串
 * @param template 自定义模板字符串，使用{index}来表示参数，index表示参数序号
 * @param params 多个参数
 * @example
 * ```
 * let template = "My name is {0}, my age is {1}, my sex is {2}."
 * let params = ["fy", "16"]
 * get_template_string(template, ...params)
 * // => My name is fy, my age is 16, my sex is {2}.
 * ```
 */
export declare const get_template_string: (template: string, ...params: string[]) => string;
