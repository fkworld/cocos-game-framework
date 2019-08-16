import { FVersion } from "./FVersion";
import { FLog } from "./FLog";

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

    /** 设置一个key的值,缓存+本地存储 */
    function set_item(key: string, value: string) {
        cache.set(key, value)
        Promise.resolve().then(() => { cc.sys.localStorage.setItem(key, value) })
    }

    /** 获取一个key的值,优先从缓存中获取 */
    function get_item(key: string): string | null {
        if (cache.get(key) === undefined || cache.get(key) === null) {
            cache.set(key, cc.sys.localStorage.getItem(key))
        }
        return cache.get(key)
    }

    export function init_local_data() {
        // 预处理
        if (FVersion.is_dev()) {
            set_init(false)
        }
        FLog.log(`@FLocal: ${get_init() ? "已获取用户本地数据" : "未获取用户本地数据,正在初始化..."}`)
        if (get_init()) { return }
        // 初始化本地存储
        clear_all()
        set_sound(true)
        set_language("chinese")
        // 初始化完毕之后,置is_init为true
        set_init(true)
    }

    /** 谨慎使用:清理所有本地数据 */
    export function clear_all() {
        cc.sys.localStorage.clear()
    }

    /** 是否初始化,默认为false */
    export function get_init(): boolean { return get_item("GameInit") === `${true}` }
    export function set_init(v: boolean) { set_item("GameInit", `${v}`) }

    /** 声音开关,默认为false */
    export function get_sound(): boolean { return get_item("GameSound") === `${true}` }
    export function set_sound(v: boolean) { set_item("GameSound", `${v}`) }

    /** 语言,默认为null */
    export function get_language(): string { return get_item("GameLanguage") }
    export function set_language(v: string) { return set_item("GameLanguage", `${v}`) }

}
