// 本地存储模块

import { version } from "./version";

/** 本地存储配置 */
export interface ConfigLocal {
    /** 语言 */
    "language": string,
    /** 音乐开关 */
    "music": true,
    /** 音效开关 */
    "sound": true,
    [k: string]: string | boolean | number,
}

/** 缓存 */
let local: Map<string, string>;

/** 默认值 */
let defaults: ConfigLocal

/**
 * 在运行时初始化
 * @param config
 */
export const init_local_runtime = (config: ConfigLocal) => {
    local = new Map()
    defaults = config
    version.has("resetLocal") && cc.sys.localStorage.clear()
}

/**
 * 获取本地存储值
 * - 返回值会转化为string或null
 * - 顺序依次为：缓存，本地存储，配置的默认值
 * @param key
 */
export const get_local = (key: string): string => {
    let value = local.get(key) ?? cc.sys.localStorage.getItem(key) ?? `${defaults[key]}`
    local.set(key, value)
    return value
}

/**
 * 修改本地存储
 * @param key
 * @param value
 */
export const set_local = (key: string, value: string) => {
    local.set(key, value)
    Promise.resolve().then(() => {
        cc.sys.localStorage.setItem(key, value)
    })
}
