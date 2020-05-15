/**
 * 在编辑器中载入 meta 数据
 * @param file
 */
export declare const _init_meta_editor_async: (file: string) => Promise<void>;
/**
 * 在运行时载入meta数据
 * @param file
 */
export declare const _init_meta_runtime_async: (file: string) => Promise<void>;
/** meta的基础类 */
export declare class MetaBase {
    /** 对应meta表的名称 */
    static meta_names: string[];
    /** 临时存储的合并表，合并多个表的内容 */
    static _meta_merge: any;
    /** 在获取时初始化 */
    static get meta_merge(): any;
    /** 是否是不存在id而使用的默认值 */
    is_default: boolean;
    /** 创建meta类实例时，对传入的单行源数据进行处理 */
    use_special(s: object): void;
    /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
    use_default(id: string): void;
}
/**
 * 设置meta类上下文的装饰器函数
 * @param meta_names meta 配置表名（推荐不附带后缀名）
 */
export declare const DeSetMetaContext: (...meta_names: string[]) => (constructor: typeof MetaBase) => void;
/**
 * 获取单个的meta
 * @param meta_class
 * @param id
 */
export declare const get_meta: <T extends typeof MetaBase>(meta_class: T, id: string) => InstanceType<T>;
/**
 * 获取meta数组
 * @param meta_class
 */
export declare const get_metas: <T extends typeof MetaBase>(meta_class: T) => InstanceType<T>[];
/**
 * 获取所有meta的id数组
 * @param meta_class
 */
export declare const get_metas_ids: <T extends typeof MetaBase>(meta_class: T) => string[];
