// 通用方法

/**
 * 求一个数的正数模
 * @param n
 * @param mode
 */
export const get_positive_mode = (n: number, mode: number) => {
  return ((n % mode) + mode) % mode;
};

/**
 * 等待n秒
 * @param time 单位s
 */
export const do_delay = async (time: number) => {
  await new Promise(res => setTimeout(res, time * 1e3));
};

/**
 * 等待执行
 * @param f_do 执行函数
 * @param f_is 判定函数
 * @param wait_all 最高等待时间
 * @param wait_interval 等待间隔
 */
export const wait_for_do = async (
  f_do: Function,
  f_is: Function,
  wait_all = 5,
  wait_interval = 0.5
) => {
  let time = 0;
  for (let i = 0; i < 100; i += 1) {
    if (!!f_is()) {
      f_do();
      break;
    } else {
      time += wait_interval;
      if (time >= wait_all) {
        break;
      }
      await do_delay(wait_interval);
    }
  }
};

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
  return template.replace(/\{([0-9]+?)\}/g, (match, index) => params[index] ?? `\{${index}\}`);
};

/**
 * 判断是否为 string 类型
 * @param x
 */
export const is_string = (x: any): x is string => typeof x === "string";

/**
 * 判断是否为 number 类型
 * @param x
 */
export const is_number = (x: any): x is number => typeof x === "number";
