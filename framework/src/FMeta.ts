import { FTool } from "./FTool"

/**
 * 数据配置表模块
 * - 使用papaparse库将所有csv数据表转为json文件（参考ToolCsv），并在游戏开始时载入；未来可以通过网络载入json数据
 * - 通过get_meta方法，将源数据转成对应的类
 * - TODO: 是否需要建立在编辑器中载入meta数据？
 */
export namespace FMeta {

    /** 输出log */
    const TAG = "@FMeta:"

    /**
     * 在编辑器中载入json文件
     * - TODO: 需要思考是否需要
     * @param file
     */
    export const init_editor_async = async (file: string) => {
        if (CC_EDITOR && Object.keys(json).length === 0) {
            json = (await FTool.load_res(file, cc.JsonAsset)).json
            cc.log(TAG, "在编辑器中载入json资源", json)
        }
    }

    export const init_async = async (file: string) => {
        try {
            json = (await FTool.load_res(file, cc.JsonAsset)).json
            cc.log(TAG, "meta资源载入成功", json)
        } catch (error) {
            cc.error(TAG, "meta资源载入失败，请重新载入", error)
        }
    }

    /** json数据内容 */
    let json = {}

    /** meta的基础类 */
    export class MetaBase {
        /** 对应meta表的名称 */
        static meta_names: string[]
        /** 临时存储的合并表，合并多个表的内容 */
        static meta_merge: {} = null
        /** 在获取时初始化 */
        static get_meta_merge() {
            if (!this.meta_merge) {
                this.meta_merge = this.meta_names.reduce((r, name) => {
                    r = { ...json[name] }
                    return r
                }, {})
            }
            return this.meta_merge
        }
        /** 是否是不存在id而使用的默认值 */
        is_default: boolean
        /** 创建meta类实例时，对传入的单行源数据进行处理 */
        use_special(s: object): void { }
        /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
        use_default(id: string): void { }
    }

    /**
     * 设置meta类上下文的装饰器函数
     * @param meta_names
     */
    export const SetMetaContext = (...meta_names: string[]) => {
        return (constructor: typeof MetaBase) => {
            constructor.meta_names = meta_names
        }
    }

    /**
     * 获取单个的meta
     * @param meta_class
     * @param id
     */
    export const get_meta = <T extends typeof MetaBase>(meta_class: T, id: string): InstanceType<T> => {
        let meta = new meta_class()
        let source = meta_class.get_meta_merge()[id]
        source ? meta.use_special(source) : meta.use_default(id)
        return meta as any
    }

    /**
     * 获取meta数组
     * @param meta_class
     */
    export const get_metas = <T extends typeof MetaBase>(meta_class: T): InstanceType<T>[] => {
        return Object.keys(meta_class.get_meta_merge()).map(id => get_meta(meta_class, id))
    }

    /**
     * 获取所有meta的id数组
     * @param meta_class
     */
    export const get_metas_ids = <T extends typeof MetaBase>(meta_class: T): string[] => {
        return Object.keys(meta_class.get_meta_merge())
    }
}
