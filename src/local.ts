/**
 * 本地存储模块
 * - 需要初始化，传入本地存储的默认值配置，是否清理
 * @see https://www.yuque.com/fengyong/game-develop-road/pa4s9d
 */

/**
 * 本地存储配置
 * @property key 存储在本地的key
 * @property value 默认值，可以为string，boolean，number，但是在获取时只会获取到string
 */
export interface ConfigLocal {
  [k: string]: string | boolean | number;
}

/** 缓存 */
let locals: Map<string, string>;

/** 默认值 */
let locals_default: ConfigLocal;

/**
 * 初始化本地存储模块
 * @since 1.0.0
 * @param config
 * @param is_clear 是否清理本地存储
 */
export function _init_local(config: ConfigLocal = {}, is_clear: boolean): void {
  locals = new Map();
  locals_default = config;
  is_clear && cc.sys.localStorage.clear();
}

/**
 * 获取本地存储值
 * - 无值，则返回undefined
 * - 顺序依次为：缓存，本地存储，临时给定的默认值，配置的默认值
 * @since 1.0.0
 * @param key
 */
export function get_local(key: string, temp_default?: string): string {
  let value =
    locals.get(key) ?? cc.sys.localStorage.getItem(key) ?? temp_default ?? `${locals_default[key]}`;
  if (value === `${undefined}`) {
    value = undefined;
  }
  locals.set(key, value);
  return value;
}

/**
 * 修改本地存储
 * @since 1.0.0
 * @param key
 * @param value
 */
export function set_local(key: string, value: string | number | boolean): void {
  locals.set(key, `${value}`);
  Promise.resolve().then(() => cc.sys.localStorage.setItem(key, value));
}
