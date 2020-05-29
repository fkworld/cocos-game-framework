/**
 * 工具函数模块
 * - 无特定分类
 */
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
export declare const is_string: (x: any) => x is string;
export declare const is_number: (x: any) => x is number;
export declare const is_boolean: (x: any) => x is boolean;
export declare const is_function: (x: any) => x is Function;
export declare const is_object: (x: any) => x is object;
export declare const is_symbol: (x: any) => x is symbol;
export declare const is_bigint: (x: any) => x is bigint;
export declare const is_undefined: (x: any) => x is undefined;
export declare const is_array: (x: any) => x is any[];
