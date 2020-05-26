/**
 * 工具函数模块
 * - 无特定分类
 */

/**
 * 求一个数的正数模
 * @param n
 * @param mode
 */
export const get_positive_mode = (n: number, mode: number) => ((n % mode) + mode) % mode;

/**
 * 等待n秒
 * @param time 单位s
 */
export const do_delay = (time: number): Promise<void> =>
  new Promise(res => setTimeout(res, time * 1e3));

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
export const get_template_string = (template: string, ...params: string[]): string => {
  return template.replace(/{([0-9]+)}/g, (match, index) => params[index] ?? `{${index}}`);
};

export const is_string = (x: any): x is string => typeof x === "string";
export const is_number = (x: any): x is number => typeof x === "number";
export const is_boolean = (x: any): x is boolean => typeof x === "boolean";
export const is_function = (x: any): x is Function => typeof x === "function";
export const is_object = (x: any): x is object => typeof x === "object";
export const is_symbol = (x: any): x is symbol => typeof x === "symbol";
export const is_bigint = (x: any): x is bigint => typeof x === "bigint";
export const is_undefined = (x: any): x is undefined => typeof x === "undefined";

export const is_array = (x: any): x is Array<any> => x instanceof Array;
