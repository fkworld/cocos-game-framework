import { DataLocal } from "../data/DataLocal";
import { FVersion } from "./FVersion";

/** 本地数据key */
type TypeLocalKey = keyof typeof DataLocal

/**
 * [framework] 本地数据存储(统一管理)
 * - [注意] key不能重复
 * - [注意] 当没有key的对应值时,会返回null
 * - [注意] cc.sys.localStorage.getItem返回值为string或者null,在缓存中也是
 * - [特别注意] 考虑cc.sys.localStorage相应方法的的消耗(特别是针对微信小游戏平台的,还需要减少同步次数),新增2种解决方案
 *  - 1.建立缓存结构
 *  - 2.采用异步Promise封装存储过程(可能存在的问题是:在退出游戏时存储可能会导致游戏存储失败)
 */
export namespace FLocal {

    /** 缓存;加快存储的效率,均存储为string格式 */
    let cache_map: Map<string, string> = new Map()

    export function init_local_data() {
        // 预处理
        FVersion.get_version().has_state("dev") && set("init", `${false}`)
        // 正式处理
        if (get("init") === `${true}`) {
            cc.log("@FLocal: 已获取用户本地数据")
        } else {
            cc.log("@FLocal: 未获取用户本地数据,正在初始化...")
            cc.sys.localStorage.clear()
            set("init", `${true}`)
        }
    }

    /** 获取:优先从缓存中获取 */
    export function get(key: TypeLocalKey): string {
        let value = cache_map.get(key)
        if (value === undefined) {
            value = cc.sys.localStorage.getItem(key) || `${DataLocal[key]}`
            cache_map.set(key, value)
        }
        return value
    }

    /** 设置 */
    export function set(key: TypeLocalKey, value: string) {
        cache_map.set(key, value)
        Promise.resolve().then(() => {
            cc.sys.localStorage.setItem(key, value)
        })
    }

}
