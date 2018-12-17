const { ccclass } = cc._decorator
/** 配置参数 */
const C = {
    FAKE_PATH: '__fake_path__',
}
Object.freeze(C)

/**
 * [framework-M] 动态资源管理
 * - 载入变动的资源文件
 * - 资源路径需要在resource文件夹下，资源路径写在模块开头的C中
 * - 脚本需要挂载在尽量靠前的位置
 * - [注意天坑] 编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同），因此在载入完成后需要对数组进行排序。排序算法是依据资源的name属性，选取资源name属性的第1个字符转换为数字后进行排序
 */
@ccclass
export class MRes extends cc.Component {

    static ins: MRes

    onLoad() {
        MRes.ins = this
    }

    array_fake: any[] = []

    /** 资源载入链 */
    async load_chain() {
        this.array_fake = await MRes.load_res_dir(C.FAKE_PATH, cc.Prefab)
    }

    /**
     * 载入单个资源
     * - 输出log
     * @param path 
     * @param type 
     * @static
     * @async
     */
    static async load_res(path: string, type: typeof cc.Asset) {
        return await new Promise((resolve, reject) => {
            cc.loader.loadRes(path, type, (err, res) => {
                if (err) {
                    // 载入失败
                    cc.error(`[${MRes.name}] resource load fail, path=${path}, type=${type}, error=${err}`)
                    reject(err)
                } else {
                    // 载入成功
                    resolve(res)
                }
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
                if (err) {
                    // 载入失败
                    cc.error(`[${MRes.name}] resource load fail, path=${path}, type=${type.name}, error=${err}`)
                    reject(err)
                } else {
                    // 载入成功
                    cc.warn(`[${MRes.name}] resource load success, path=${path}, length=${res.length}, ${res.length === 0 ? 'please check again' : ''}`)
                    resolve(res)
                }
            })
        })
    }

    /**
     * 资源排序：根据name属性的第一个数字
     * @param a 
     * @param b 
     */
    static sort_by_name(a: any, b: any) {
        return Number.parseInt(a.name[0]) - Number.parseInt(b.name[0])
    }
}
