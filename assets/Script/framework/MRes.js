import G from "./Global";

const { ccclass, property } = cc._decorator
/** 配置参数 */
const C = {
    /** panel资源路径参数 */
    PATH_PANEL: "panel",
    /** audio资源路径参数 */
    PATH_AUDIO: "audio",
}

/**
 * 框架文件：资源管理器
 * - 针对变动的动态文件
 * - 资源路径写在模块开头的C中
 * - 资源路径需要在resource文件夹下
 * - 脚本需要挂载在尽量靠前的位置
 * @class
 */
@ccclass
export default class MRes extends cc.Component {

    /** @type {MRes} */
    static ins

    onLoad() {
        // 初始化
        this.load_count = 0
        this.total_count = 0

        // 初始化存储
        /** panel数组 */
        this.array_panel = Array.of()
        /** audio数组 */
        this.array_audio = Array.of()

        // 链式加载
        // 在AppMain中显式加载
        // this.load_chain()

        // 保存实例
        MRes.ins = this
    }

    /** @type {number} 总计数 */
    get total_count() { return this._total_count }
    set total_count(count) { this._total_count = count }

    /** @type {number} 载入计数 */
    get load_count() { return this._load_count }
    set load_count(count) { this._load_count = count }

    /** 
     * 资源加载链
     * @returns {Promise}
     */
    load_chain() {
        return G.run_promise_chain(Array.of(
            () => { return this.load_res(C.PATH_AUDIO, cc.AudioClip, this.array_audio) },
            () => { return this.load_res(C.PATH_PANEL, cc.Prefab, this.array_panel) },
        ))
    }

    /**
     * 载入资源
     * @param {string} path 路径
     * @param {typeof cc.Asset} type 类型
     * @param {[]} array 资源数组
     */
    load_res(path, type, array) {
        return new Promise((resolve, reject) => {
            cc.loader.loadResDir(
                // 路径
                path,
                // 格式
                type,
                // 载入全部资源后的回调函数
                (err, res) => {
                    // 载入失败
                    if (err) {
                        cc.log("载入资源失败，path&type=", path, type.toString(), "err=", err)
                        reject()
                        return
                    }
                    // 写入数据
                    // 其中两个count并非是在载入过程中写入，而是在最后统计过程中写入；原因是载入过程机制不明
                    this.total_count += res.length
                    for (let r of res) {
                        array.push(r)
                        this.load_count += 1
                    }
                    // 载入成功
                    cc.log("资源载入成功，path=", path)
                    resolve()
                }
            )
        })
    }
}