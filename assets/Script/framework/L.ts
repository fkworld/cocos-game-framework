/**
 * [framework] 本地数据存储（LocalData）管理类
 * - [注意] key不能重复
 * - [注意] cc.sys.localStorage.getItem()返回值为string或者null，缓存中也是，但是在实际调用中会进行预处理
 * - [注意] 当没有key的对应值时，会返回null
 * - [注意] 应该避免使用setter和getter函数，转为使用对应的set和get方法
 * - [特别注意] 考虑cc.sys.localStorage相应方法的的消耗（特别是针对微信小游戏平台的，还需要减少同步次数），新增2种解决方案：1.建立缓存结构；2.采用异步Promise封装存储过程，可能存在的问题是：在退出游戏时存储可能会导致游戏存储失败（未经过实际测试）
 */
export class L {

    /** 缓存 */
    static cache = {}

    /** 封装设置item */
    static set_item(key: string, value: any) {
        L.cache[key] = value
        new Promise(() => {
            setTimeout(() => {
                cc.sys.localStorage.setItem(key, value)
            }, 5000);
        })
    }

    /** 封装获取item */
    static get_item(key: string): string | null {
        if (L.cache[key] === undefined) {
            let value = cc.sys.localStorage.getItem(key)
            L.cache[key] = value
            return value
        } else {
            return L.cache[key]
        }
    }

    /** 是否初始化，默认为false */
    static get init() { return L.get_item('Init') === `${true}` }
    static set init(v: boolean) { L.set_item('Init', v) }


    /** 音效，默认为false */
    static get sound() { return L.get_item('Sound') === `${true}` }
    static set sound(v: boolean) { L.set_item('Sound', v) }


    /** 语言，默认为null，在Mi18n中配置默认语言 */
    static get language() {
        let v = Number.parseInt(L.get_item('Language'))
        return v === NaN ? null : v
    }
    static set language(v: number) { L.set_item('Language', v) }

    //////////
    // 下面的内容需要添加每个游戏自身的本地存储；注意使用static方法
    //////////
}