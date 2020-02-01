import { FTool } from "./FTool"
import { FState } from "./FState"

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

    /** 完整的 csv 文件 */
    type Csv = Map<string, CsvLine>

    /** 单行 csv */
    export type CsvLine = Map<string, string>

    /**
     * meta类的状态
     * - prepare 正在载入
     * - ok 载入成功
     * - error 载入失败
     */
    type MetaState = "prepare" | "ok" | "error"

    /** meta 的基础抽象类 */
    export class MetaBase {
        /** meta 类的上下文信息 */
        static context: {
            // 源文件路径表
            file_path_list: string[]
            // 源数据
            file_source: Csv
            // 状态
            state: FState.StateJumpTable<MetaState>
        } = null
        /** 创建 meta 类实例时，对传入的单行源数据进行处理 */
        on_load(source: CsvLine): void { }
    }

    /** 设置 meta 类上下文的装饰器函数 */
    export function SetMetaContext(config: {
        file_path_list: string[]
    }) {
        return (constructor: typeof MetaBase) => {
            constructor.context = {
                file_path_list: config.file_path_list,
                state: new FState.StateJumpTable<MetaState>({
                    "prepare": ["ok", "error"],
                    "ok": [],
                    "error": [],
                }, "prepare"),
                file_source: new Map(),
            }
            // 非编辑器模式下，载入资源
            !CC_EDITOR && Promise.all(config.file_path_list.map(v => load_csv(v)))
                .then(csv_list => {
                    constructor.context.file_source = merge_csv(...csv_list)
                    constructor.context.state.try_change_state("ok")
                    cc.log(`@FMeta: 载入meta数据成功, class=${constructor.name}, data=`, constructor.context.file_source)
                })
                .catch(error => {
                    constructor.context.state.try_change_state("error")
                    cc.error(`@FMeta: 载入meta数据失败, class= ${constructor.name}, error = ${error} `)
                })
        }
    }

    /** 一些判定正则 */
    const REGEX = {
        // 注释行
        COMMENT_LINE: /^#/,
        // 属性行
        PROPERTY_LINE: /^@/,
        // 逗号
        COMMA: /##/g,
    }

    /**
     * 载入单个 csv 文件
     * @param file_path
     */
    async function load_csv(file_path: string): Promise<Csv> {
        // 行数组
        let line_list: string[] = (await FTool.load_res(file_path, cc.TextAsset)).text.split(/\r?\n/)
        // 属性名称数组
        let property_name_list: string[] = []
        // 处理结果
        let csv: Csv = new Map()
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
                let csv_line: CsvLine = new Map(property_name_list.map((property, index) => {
                    // 替换##为逗号
                    let block = block_list[index] || ""
                    block = block.replace(REGEX.COMMA, ",")
                    return [property, block]
                }))
                csv.set(id, csv_line)
            }
        })
        return csv
    }

    /**
     * 合并多个 csv 文件
     * @param csv_list
     */
    function merge_csv(...csv_list: Csv[]): Csv {
        let all_csv: Csv = new Map()
        csv_list.forEach(csv => {
            csv.forEach((csv_line, id) => {
                all_csv.set(id, new Map([...all_csv.has(id) ? all_csv.get(id) : [], ...csv_line]))
            })
        })
        return all_csv
    }

    /**
     * 获取单个的 meta
     * @param meta_class
     * @param id
     */
    export function get_meta<T extends typeof MetaBase>(meta_class: T, id: string | number): InstanceType<T> {
        let meta_source = meta_class.context.file_source.get(`${id}`)
        if (meta_source) {
            let meta = new meta_class()
            meta.on_load(meta_source)
            return meta as any
        } else {
            return null
        }
    }

    /**
     * 获取 meta 数组
     * @param meta_class
     */
    export function get_metas<T extends typeof MetaBase>(meta_class: T): InstanceType<T>[] {
        return [...meta_class.context.file_source.keys()].map(id => get_meta(meta_class, id))
    }
}
