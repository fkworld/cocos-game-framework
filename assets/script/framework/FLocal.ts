import { FLog } from "./FLog";
import { FVersion } from "./FVersion";
import { local } from "../data/local";

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
    let cache: Map<string, string> = new Map()

    export function init_local_data() {
        // 预处理
        if (FVersion.is_dev()) {
            set("init", `${false}`)
        }
        if (get("init") === `${true}`) {
            FLog.log("@FLocal: 已获取用户本地数据")
        } else {
            FLog.log("@FLocal: 未获取用户本地数据,正在初始化...")
            clear_all()
            set("init", `${true}`) // 初始化完毕之后,置init为true
        }
    }

    /** 谨慎使用:清理所有本地数据 */
    export function clear_all() {
        cc.sys.localStorage.clear()
    }

    /** 获取:优先从缓存中获取 */
    export function get(key: keyof typeof local): string {
        let value = cache.get(key)
        if (value === undefined || value === null) {
            value = cc.sys.localStorage.getItem(key) || `${local[key]}`
        }
        cache.set(key, value)
        return value
    }

    export function set(key: keyof typeof local, value: string) {
        cache.set(key, value)
        Promise.resolve().then(() => { cc.sys.localStorage.setItem(key, value) })
    }

}
