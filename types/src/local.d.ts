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
/**
 * 初始化本地存储模块
 * @since 1.0.0
 * @param config
 * @param is_clear 是否清理本地存储
 */
export declare function _init_local(config: ConfigLocal, is_clear: boolean): void;
/**
 * 获取本地存储值
 * - 无值，则返回undefined
 * - 顺序依次为：缓存，本地存储，临时给定的默认值，配置的默认值
 * @since 1.0.0
 * @param key
 */
export declare function get_local(key: string, temp_default?: string): string;
/**
 * 修改本地存储
 * @since 1.0.0
 * @param key
 * @param value
 */
export declare function set_local(key: string, value: string | number | boolean): void;
