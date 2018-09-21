import G from "./G";

const { ccclass } = cc._decorator
/** 配置参数 */
const C = {
    /** test资源路径参数（假路径） */
    PANEL_TEST: '__test',
}
Object.freeze(C)

/**
 * 【框架】动态资源管理
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

        /** @type {Array<>} test数组 */
        this.array_test = Array.of()
    }

    /**
     * 资源加载链
     * @returns {Promise}
     */
    load_chain() {
        return G.run_promise_chain(Array.of(
            () => {
                return MRes.load_res_dir(C.PANEL_TEST, cc.Prefab).then((v) => {
                    this.array_test = Array.from(v)
                })
            },
        ))
    }

    /**
     * 载入单个资源
     * - 使用Promise进行封装
     * - 输出log
     * @param {string} path 路径
     * @param {cc.Asset} type 资源类型
     * @returns {Promise}
     * @static
     */
    static load_res(path, type) {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(path, type, (err, res) => {
                // 载入失败
                if (err) {
                    cc.error('[MRes] 资源载入失败，error=', err, 'path=', path, 'type=', type)
                    reject()
                    return
                }
                // 载入成功
                // cc.warn('[MRes] 资源载入成功，path=', path)
                resolve(res)
            })
        })
    }

    /**
     * 载入dir资源
     * - 使用Promise进行封装
     * - 输出log
     * @param {string} path 路径
     * @param {cc.Asset} type 类型
     * @returns {Promise}
     */
    static load_res_dir(path, type) {
        return new Promise((resolve, reject) => {
            cc.loader.loadResDir(path, type, (err, res) => {
                // 载入失败
                if (err) {
                    cc.error('[MRes] 资源载入失败，error=', err, 'path=', path, 'type=', type)
                    reject()
                    return
                }
                // 载入成功
                cc.warn('[MRes] 资源载入成功，path=', path, 'length=', res.length)
                if (res.length === 0) {
                    cc.error('[MRes] 注意，资源个数为0，请检查path，=', path)
                }
                // 写入数据
                let array = Array.of()
                for (let r of res) { array.push(r) }
                resolve(array)
            })
        })
    }
}