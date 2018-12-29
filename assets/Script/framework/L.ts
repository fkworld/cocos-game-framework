/**
 * [framework] 本地数据存储（LocalData）管理类
 * - [注意] key不能重复
 * - [注意] get函数的返回值，由于游戏引擎原因，均返回string，这里不做类型转换，实际使用过程中需要注意
 * - [注意] 当没有key的对应值时，会返回null
 * - [注意] 应该避免使用setter和getter函数，转为使用对应的set和get方法
 */
export class L {

    /** 封装设置item */
    static set_item(key: string, value: any) { cc.sys.localStorage.setItem(key, value) }

    /** 封装获取item */
    static get_item(key: string): string | null { return cc.sys.localStorage.getItem(key) }

    /** 是否初始化 */
    static set_init(v: boolean) { L.set_item('Init', v) }
    static get_init() { return L.get_item('Init') }

    /** 音效 */
    static set_sound(v: boolean) { L.set_item('Sound', v) }
    static get_sound() { return L.get_item('Sound') }

    /** 语言 */
    static set_language(v: number) { L.set_item('Language', v) }
    static get_language() { return L.get_item('Language') }

    //////////
    // 下面的内容需要添加每个游戏自身的本地存储；注意使用static方法
    //////////
}
