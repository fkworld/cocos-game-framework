/**
 * 数值表模块
 * - 需要在编辑器中手动将resources/csv下的csv文件生成ts文件
 * - 需要在运行时载入
 * - csv格式时为了更好的组织数值，也可以直接传入数值，结构为name-id-key-value三级对象，均为string
 */
export declare type ConfigMeta = {
    [meta: string]: {
        [id: string]: {
            [key: string]: string;
        };
    };
};
export declare const _init_meta: (config?: ConfigMeta) => void;
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
 * @param meta_names meta配置表名
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
/**
 * 解析csv文件为json对象
 * @param source csv文件内容
 */
export declare const _parse_csv: (source: string) => {};
/**
 * 将resoueces/csv/路径下的所有csv文件，转换为同路径下的json文件
 */
export declare const parse_csv_all: () => Promise<void>;
