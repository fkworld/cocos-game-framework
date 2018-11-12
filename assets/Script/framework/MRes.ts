const { ccclass } = cc._decorator
/** 配置参数 */
const C = {
    /** test资源路径参数（假路径） */
    PANEL_TEST: '__test',
}
Object.freeze(C)

/**
 * [framework-M] 动态资源管理
 * - 针对变动的动态文件
 * - 资源路径写在模块开头的C中
 * - 资源路径需要在resource文件夹下
 * - 脚本需要挂载在尽量靠前的位置
 */
@ccclass
export default class MRes extends cc.Component {

    static ins: MRes

    onLoad() {
        MRes.ins = this
    }

    /** test数组 */
    array_test: any[] = []

    /** 资源载入链 */
    async load_chain(): Promise<void> {
        this.array_test = await MRes.load_res_dir(C.PANEL_TEST, cc.Prefab)
    }

    /**
     * 载入单个资源
     * - 输出log
     * @param path 
     * @param type 
     * @static
     * @async
     */
    static async load_res(path: string, type: typeof cc.Asset): Promise<any> {
        return await new Promise((resolve, reject) => {
            cc.loader.loadRes(path, type, (err, res) => {
                // 载入失败
                if (err) {
                    cc.error('[MRes] 资源载入失败，error=', err, 'path=', path, 'type=', type)
                    reject()
                    return
                }
                // 载入成功
                resolve(res)
            })
        })
    }

    /**
     * 载入dir资源
     * - 使用Promise进行封装
     * - 输出log
     * @param path 
     * @param type 
     * @static
     * @async
     */
    static async load_res_dir(path: string, type: typeof cc.Asset): Promise<any> {
        return await new Promise((resolve, reject) => {
            cc.loader.loadResDir(path, type, (err, res) => {
                // 载入失败
                if (err) {
                    cc.error('[MRes] 资源载入失败，error=', err, 'path=', path, 'type=', type)
                    reject()
                    return
                }
                // 载入成功
                cc.warn('[MRes] 资源载入成功，path=', path, 'length=', res.length)
                if (res.length === 0) { cc.warn('[MRes] 注意，资源个数为0，请检查path，=', path) }
                // 写入数据
                resolve(res)
            })
        })
    }
}

