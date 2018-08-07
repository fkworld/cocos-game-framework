/**
 * 框架文件：本地数据存储类
 */
class LocalData {

    /** 封装设置item */
    set_item(key, value) {
        cc.sys.localStorage.setItem(key, value)
    }

    /** 封装获取item */
    get_item(key) {
        return cc.sys.localStorage.getItem(key)
    }

    /** 是否初始化 */
    set is_init(value) { this.set_item("is_init", value) }
    get is_init() { return this.get_item("is_init") }

    /** 音乐 */
    set music(value) { this.set_item("music", value) }
    get music() { return this.get_item("music") }

    /** 音效 */
    set sound(value) { this.set_item("sound", value) }
    get sound() { return this.get_item("sound") }

    //////////
    // 下面的内容需要添加每个游戏自身的本地存储
    //////////
}

/** 本地存储实例 */
let L = new LocalData()
export default L
