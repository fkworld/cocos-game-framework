import { FTool } from "./FTool"

/**
 * 数据配置表模块
 * 1. 使用 csv 文件作为源文件，1 个 Meta 类可以对应多个 csv 文件，注意处理属性名冲突。
 * 2. 使用简化的 csv 格式：
 *      - 以 # 开头的行视为注释行，不解析
 *      - 以 @ 开头的行视为属性行，存储属性名称
 *      - 使用 ## 代替字符串中的逗号
 *      - 读取时会以属性行为基准，超过的内容行不会保存，没有的内容行会保存为空字符串
 * 3. 一些命名
 *      - file_source：1 张数据表的源内容
 *      - metas：1 张数据表上的全部内容，使用 Meta 类封装
 *      - meta：1 张数据表上单行的内容，使用 Meta 类封装
 */
export namespace FMeta {

    const TAG = "@FMeta:"       // 输出标记
    const FILES = "csv"         // 文件路径
    const REGEX = {             // 一些判定正则
        COMMENT_LINE: /^#/,     // 注释
        PROPERTY_LINE: /^@/,    // 属性
        COMMA: /##/g,           // 逗号
    }
    let json = {}               // 所有数据内容

    export async function init_async() {
        try {
            json = (await FTool.load_res_dir(FILES, cc.TextAsset)).reduce((r, v) => {
                r[v.name] = load_csv(v)
                return r
            }, {})
            cc.log(TAG, "meta资源载入成功", json)
        } catch (error) {
            cc.error(TAG, "meta资源载入失败，请重新载入")
        }
    }

    export class MetaBase {
        static meta_names: string[]         // 对应meta表的名称
        private static temp: {} = null      // 临时存储的合并表，合并多个表的内容
        static get_temp() {
            if (!this.temp) {
                this.temp = this.meta_names.reduce((r, name) => {
                    r = { ...json[name] }
                    return r
                }, {})
            }
            return this.temp
        }
        is_default: boolean                 // 是否是不存在id而使用的默认值
        use_special(s: object): void { }    // 创建 meta 类实例时，对传入的单行源数据进行处理
        use_default(id: string): void { }   // 创建 meta 类实例时，如果没有源数据，则设置为给定的默认值
    }

    /** 设置 meta 类上下文的装饰器函数 */
    export function SetMetaContext(...meta_names: string[]) {
        return (constructor: typeof MetaBase) => {
            constructor.meta_names = meta_names
        }
    }

    /**
     * 载入单个 csv 文件
     * @param file_path
     */
    function load_csv(file: cc.TextAsset): object {
        // 行数组
        let line_list: string[] = file.text.split(/\r?\n/)
        // 属性名称数组
        let property_name_list: string[] = []
        // 处理结果
        let result = {}
        // 处理过程
        line_list.forEach(line => {
            if (line === null || line.trim().length === 0) {
                // 空行
            } else if (REGEX.COMMENT_LINE.test(line)) {
                // 注释行
            } else if (REGEX.PROPERTY_LINE.test(line)) {
                // 属性行
                property_name_list = line.replace(REGEX.PROPERTY_LINE, "").split(",")
            } else {
                // 内容行
                let block_list = line.split(",")
                let id = block_list[0]
                let line_kv = property_name_list.reduce((r, v, index) => {
                    let block = block_list[index] || ""
                    block = block.replace(REGEX.COMMA, ",")
                    r[v] = block
                    return r
                }, {})
                result[id] = line_kv
            }
        })
        return result
    }

    /**
     * 获取单个的 meta
     * @param meta_class
     * @param id
     */
    export function get_meta<T extends typeof MetaBase>(meta_class: T, id: string | number): InstanceType<T> {
        let meta = new meta_class()
        let source = meta_class.get_temp()[id]
        source
            ? meta.use_special(source)
            : meta.use_default(id.toString())
        return meta as any
    }

    /**
     * 获取 meta 数组
     * @param meta_class
     */
    export function get_metas<T extends typeof MetaBase>(meta_class: T): InstanceType<T>[] {
        return Object.keys(meta_class.get_temp()).map(id => get_meta(meta_class, id))
    }

    /**
     * 获取所有meta的id数组
     * @param meta_class
     */
    export function get_metas_ids<T extends typeof MetaBase>(meta_class: T): string[] {
        return Object.keys(meta_class.get_temp())
    }
}
