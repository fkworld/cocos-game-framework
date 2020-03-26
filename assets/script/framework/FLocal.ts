import { DataLocal } from "../data/DataLocal";
import { FVersion } from "./FVersion";

/**
 * 本地存储模块
 * - 【注意】返回值均为 string 或者 null。
 */
export namespace FLocal {

    /** 本地数据 key */
    type TypeLocalKey = keyof typeof DataLocal

    /** 缓存 */
    let cache: Map<string, string> = new Map()

    /** 初始化，如果是开发版本则一直初始化 */
    export function init() {
        FVersion.version.has_state("resetLocal") && set("init", `${false}`)
        if (get("init") === `${true}`) {
            cc.log("@FLocal: 已获取用户本地数据")
        } else {
            cc.log("@FLocal: 未获取用户本地数据,正在初始化...")
            cc.sys.localStorage.clear()
            set("init", `${true}`)
        }
    }

    /** 获取，顺序为：缓存，本地存储，配置的默认值 */
    export function get(key: TypeLocalKey): string {
        let value = cache.get(key) || cc.sys.localStorage.getItem(key) || `${DataLocal[key]}`
        cache.set(key, value)
        return value
    }

    /** 存储 */
    export function set(key: TypeLocalKey, value: string) {
        cache.set(key, value)
        Promise.resolve().then(() => {
            cc.sys.localStorage.setItem(key, value)
        })
    }

}
