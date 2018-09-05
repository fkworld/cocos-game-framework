import G from "./G";

const { ccclass, property } = cc._decorator
/** 配置参数 */
const C = {
    /** panel资源路径参数 */
    PATH_PANEL: "panel",
}
Object.freeze(C)

/**
 * 框架文件：资源管理器
 * - 针对变动的动态文件
 * - 资源路径写在模块开头的C中
 * - 资源路径需要在resource文件夹下
 * - 脚本需要挂载在尽量靠前的位置
 */
@ccclass
export default class MRes extends cc.Component {

    /** @type {MRes} */
    static ins;

    onLoad() {
        MRes.ins = this

        /** @type {Array<cc.Prefab>} panel数组 */
        this.array_panel = Array.of()

        // 链式加载
        // 在AppMain中显式加载
        // this.load_chain()
    }

    /**
     * 资源加载链
     * @returns {Promise}
     */
    load_chain() {
        return G.run_promise_chain(Array.of(
            () => { return this.load_res(C.PATH_PANEL, cc.Prefab, this.array_panel) },
        ))
    }

    /**
     * 载入资源
     * @param {string} path 路径
     * @param {cc.Asset} type 类型
     * @param {Array} array 资源数组
     */
    load_res(path, type, array) {
        return new Promise((resolve, reject) => {
            cc.loader.loadResDir(path, type, (err, res) => {
                // 载入失败
                if (err) {
                    cc.log("载入资源失败，path&type=", path, type.toString(), "err=", err)
                    reject()
                    return
                }
                // 写入数据
                for (let r of res) { array.push(r) }
                // 载入成功
                cc.log("资源载入成功，path=", path)
                resolve()
            })
        })
    }
}