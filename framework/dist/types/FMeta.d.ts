/**
 * 数据配置表模块
 * - 使用papaparse库将所有csv数据表转为json文件（参考ToolCsv），并在游戏开始时载入；未来可以通过网络载入json数据
 * - 通过get_meta方法，将源数据转成对应的类
 * - TODO: 是否需要建立在编辑器中载入meta数据？
 */
export declare namespace FMeta {
    /**
     * 在编辑器中载入json文件
     * - TODO: 需要思考是否需要
     * @param file
     */
    const init_editor_async: (file: string) => Promise<void>;
    const init_async: (file: string) => Promise<void>;
    /** meta的基础类 */
    class MetaBase {
        /** 对应meta表的名称 */
        static meta_names: string[];
        /** 临时存储的合并表，合并多个表的内容 */
        static meta_merge: {};
        /** 在获取时初始化 */
        static get_meta_merge(): {};
        /** 是否是不存在id而使用的默认值 */
        is_default: boolean;
        /** 创建meta类实例时，对传入的单行源数据进行处理 */
        use_special(s: object): void;
        /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
        use_default(id: string): void;
    }
    /**
     * 设置meta类上下文的装饰器函数
     * @param meta_names
     */
    const SetMetaContext: (...meta_names: string[]) => (constructor: typeof MetaBase) => void;
    /**
     * 获取单个的meta
     * @param meta_class
     * @param id
     */
    const get_meta: <T extends typeof MetaBase>(meta_class: T, id: string) => InstanceType<T>;
    /**
     * 获取meta数组
     * @param meta_class
     */
    const get_metas: <T extends typeof MetaBase>(meta_class: T) => InstanceType<T>[];
    /**
     * 获取所有meta的id数组
     * @param meta_class
     */
    const get_metas_ids: <T extends typeof MetaBase>(meta_class: T) => string[];
}
