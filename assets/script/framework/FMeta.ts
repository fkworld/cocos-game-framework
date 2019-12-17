import { FTool } from "./FTool"
import { FState } from "./FState"

/**
 * 数据配置表模块
 * 1. 使用csv文件作为源文件,1个meta类可以对应多个csv文件,注意处理属性名冲突
 * 2. 使用简化的csv格式:
 *      - 以#开头的行视为注释行,不解析
 *      - 以@开头的行视为属性行,存储属性名称
 *      - 只解析到string类型,在on_load方法中进一步处理类型
 *      - 使用##代替字符串中的逗号
 *      - 空白则表示此值为当前行的id
 * 3. 一些命名
 *      - file_source 1张数据表的源内容
 *      - metas 1张数据表上的全部内容(使用Meta类封装)
 *      - meta 1张数据表上单行的内容(使用Meta类封装)
 */
export namespace FMeta {

    /** 完整的csv文件 */
    interface Csv { [K: string]: CsvLine }

    /** 单行csv */
    export interface CsvLine { [K: string]: string }

    /** meta的基础抽象类 */
    export class MetaBase {
        /** meta类的上下文信息 */
        static context: {
            file_path_list: string[]    // 源文件路径表
            file_source: Csv            // 源数据
            state: FState.StateJumpTable<"prepare" | "ok" | "error">    // 状态，prepare表示正在载入，ok表示载入成功，error表示载入失败
        } = null
        /** 创建meta类实例时，对传入的单行源数据进行处理 */
        on_load(source: CsvLine): void { }
    }

    /** 设置MetaContext的装饰器函数 */
    export function SetMetaContext(config: { file_path_list: string[] }) {
        return (constructor: typeof MetaBase) => {
            constructor.context = {
                file_path_list: config.file_path_list,
                state: new FState.StateJumpTable<"prepare" | "ok" | "error">("prepare", {
                    "prepare": ["ok", "error"],
                    "ok": [],
                    "error": [],
                }),
                file_source: null,
            }
            // 非编辑器模式下，载入资源
            !CC_EDITOR && Promise.all(config.file_path_list.map(v => load_csv(v)))
                .then(csv_list => {
                    constructor.context.file_source = merge_csv(...csv_list)
                    constructor.context.state.try_change_state("ok")
                    cc.log(`@FMeta: load meta ok, class=${constructor.name}`)
                })
                .catch(error => {
                    constructor.context.state.try_change_state("error")
                    cc.error(`@FMeta: load meta error, class=${constructor.name}, error=${error}`)
                })
        }
    }

    /** 一些判定正则 */
    const REGEX = {
        COMMENT_LINE: /^#/,     // 注释行
        PROPERTY_LINE: /^@/,    // 属性行
        COMMA: /##/g,           // 逗号
    }

    /**
     * 载入单个csv文件
     * @param file_path
     */
    async function load_csv(file_path: string): Promise<Csv> {
        // 行数组
        let line_list: string[] = (await FTool.load_res(file_path, cc.TextAsset)).text.split("\n")
        // 属性名称数组
        let property_name_list: string[] = []
        // 处理结果
        let csv: Csv = {}
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
                let id = Number.parseInt(block_list[0])
                let csv_line: CsvLine = {}
                block_list.forEach((block, index) => {
                    block = block.trim().length === 0 ? `${id}` : block // 替换empty为id
                    block = block.replace(REGEX.COMMA, ",")             // 替换##为逗号
                    let property_name = property_name_list[index]
                    csv_line[property_name] = block
                })
                csv[id] = csv_line
            }
        })
        return csv
    }

    /**
     * 合并多个csv文件
     * @param csv_list
     */
    function merge_csv(...csv_list: Csv[]): Csv {
        let all_csv: Csv = {}
        csv_list.forEach(csv => {
            Object.keys(csv).forEach(id => {
                if (!all_csv[id]) { all_csv[id] = {} }
                Object.assign(all_csv[id], csv[id])
            })
        })
        return all_csv
    }

    /**
     * 获取单个的meta
     * @param meta_class
     * @param id
     */
    export function get_meta<T extends typeof MetaBase>(meta_class: T, id: string | number): InstanceType<T> {
        let meta = new meta_class()
        meta.on_load(meta_class.context.file_source[id])
        return meta as any
    }

    /**
     * 获取meta数组
     * @param meta_class
     */
    export function get_metas<T extends typeof MetaBase>(meta_class: T): InstanceType<T>[] {
        return Object.keys(meta_class.context.file_source).map(id => get_meta(meta_class, id))
    }
}
