/**
 * 工具函数模块
 * - 无特定分类
 */

/**
 * 求一个数的正数模
 * @param n
 * @param mode
 */
export function get_positive_mode(n: number, mode: number) {
  return ((n % mode) + mode) % mode;
}

/**
 * 等待n秒
 * @param time 单位s
 */
export async function do_delay(time: number): Promise<void> {
  await new Promise(res => setTimeout(res, time * 1e3));
}

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
export function get_template_string(template: string, ...params: string[]): string {
  return template.replace(/{([0-9]+)}/g, (match, index) => params[index] ?? `{${index}}`);
}

export function is_string(x: any): x is string {
  return typeof x === "string";
}
export function is_number(x: any): x is number {
  return typeof x === "number";
}
export function is_boolean(x: any): x is boolean {
  return typeof x === "boolean";
}
export function is_function(x: any): x is Function {
  return typeof x === "function";
}
export function is_object(x: any): x is object {
  return typeof x === "object";
}
export function is_symbol(x: any): x is symbol {
  return typeof x === "symbol";
}
export function is_bigint(x: any): x is bigint {
  return typeof x === "bigint";
}
export function is_undefined(x: any): x is undefined {
  return typeof x === "undefined";
}
export function is_array(x: any): x is Array<any> {
  return x instanceof Array;
}
