import { FVersion } from "./FVersion";

/**
 * 本地存储模块
 * - 【缓存】考虑在某些平台中localStorage方法的损耗，因此需要缓存
 * - 【注意】返回值均为string或者null。
 */
export namespace FLocal {

    /** 输出log */
    const TAG = "@FLocal:"

    /** 本地存储配置 */
    export interface ConfigLocal {
        "language": "chinese",  // 语言
        "music": true,          // 音乐开关
        "sound": true,          // 音效开关
        [k: string]: string | boolean | number,
    }

    /** 缓存 */
    let cache: Map<string, string> = new Map()

    /** 默认值 */
    let defaults: ConfigLocal

    /** 初始化，如果是开发版本则一直初始化 */
    export const init = (config: ConfigLocal) => {
        cache = new Map()
        defaults = config
        FVersion.version.has("resetLocal") && cc.sys.localStorage.clear()
    }

    /** 获取，顺序为：缓存，本地存储，配置的默认值 */
    export const get = (key: string): string => {
        let value = cache.get(key) ?? cc.sys.localStorage.getItem(key) ?? `${defaults[key]}`
        cache.set(key, value)
        return value
    }

    /** 存储 */
    export const set = (key: string, value: string) => {
        cache.set(key, value)
        Promise.resolve().then(() => {
            cc.sys.localStorage.setItem(key, value)
        })
    }

}
