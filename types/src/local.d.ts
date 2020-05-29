/**
 * 本地存储模块
 * - 需要在运行时初始化
 */
/**
 * 本地存储配置
 * - key 表示存储在本地的key
 * - value 表示默认值，可以为string，boolean，number，但是在获取时只会获取到string
 */
export interface ConfigLocal {
    /** 语言 */
    language: string;
    /** 音乐开关 */
    music: boolean;
    /** 音效开关 */
    sound: boolean;
    [k: string]: string | boolean | number;
}
/**
 * 在运行时初始化
 * @param config
 */
export declare const _init_local: (config?: ConfigLocal) => void;
/**
 * 获取本地存储值
 * - 无值，则返回undefined
 * - 顺序依次为：缓存，本地存储，配置的默认值
 * @param key
 */
export declare const get_local: (key: string) => string;
/**
 * 修改本地存储
 * @param key
 * @param value
 */
export declare const set_local: (key: string, value: string) => void;
