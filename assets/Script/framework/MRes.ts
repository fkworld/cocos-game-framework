import { G } from "./G";

/** 配置参数 */
const C = {
    FAKE_PATH: '__fake_path__',
}

/**
 * [M] 动态资源管理
 * - 载入变动的资源文件
 * - 资源路径需要在resource文件夹下，资源路径写在模块开头的C中
 * - 脚本需要挂载在尽量靠前的位置
 * - [注意天坑] 编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同），因此在载入完成后需要对数组进行排序。排序算法是依据资源的name属性，选取资源name属性的第1个字符转换为数字后进行排序
 */
export class MRes {

    static ins: MRes

    /** 初始化 */
    static async init() {
        G.check_ins(MRes)
        MRes.ins = new MRes()
        return await MRes.ins.load_all()
    }

    array_fake: any[] = []

    /** 资源载入 */
    async load_all() {
        [this.array_fake] = await Promise.all([
            MRes.load_res_dir(C.FAKE_PATH, cc.Prefab),
        ])
    }

    /**
     * 载入单个资源
     * - 输出log
     * @param path 
     * @param type 
     * @static @async
     */
    static async load_res<T extends typeof cc.Asset>(path: string, type: T): Promise<any> {
        return await new Promise((res, rej) => {
            cc.loader.loadRes(path, type, (err, resource) => {
                if (err) {
                    cc.error(`[${MRes.name}] resource load fail, path=${path}, type=${type}, error=${err}`)
                    rej(err)
                } else {
                    res(resource)
                }
            })
        })
    }

    /**
     * 载入dir资源
     * - 输出log
     * @param path 
     * @param type 
     * @static @async
     */
    static async load_res_dir<T extends typeof cc.Asset>(path: string, type: T): Promise<any[]> {
        return await new Promise((res, rej) => {
            cc.loader.loadResDir(path, type, (err, resource) => {
                if (err) {
                    cc.error(`[${MRes.name}] resource load fail, path=${path}, type=${type.name}, error=${err}`)
                    rej(err)
                } else {
                    cc.warn(`[${MRes.name}] resource load success, path=${path}, length=${res.length}, ${res.length === 0 ? 'please check again' : ''}`)
                    res(resource)
                }
            })
        })
    }

    /**
     * 资源排序：根据name属性的第一个数字
     * @param a 
     * @param b 
     * @static
     */
    static sort_by_name<T extends typeof cc.Asset>(a: T, b: T) {
        return Number.parseInt(a.name[0]) - Number.parseInt(b.name[0])
    }
}
