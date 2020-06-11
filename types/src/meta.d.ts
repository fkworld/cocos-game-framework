export declare type ConfigMeta = {
    [meta_name: string]: {
        [id: string]: {
            [key: string]: string;
        };
    };
};
export declare function _init_meta(config?: ConfigMeta): void;
/** meta基类，需要被继承 */
export declare class MetaBase {
    /** meta数据表名 */
    static meta_name: string;
    static get_meta_source(id?: string): {
        [key: string]: string;
    } | {
        [id: string]: {
            [key: string]: string;
        };
    };
    /** 是否是不存在id而使用的默认值 */
    is_default: boolean;
    /** 创建meta类实例时，对传入的单行源数据进行处理 */
    use_special(s: object): void;
    /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
    use_default(id: string): void;
}
/**
 * 设置meta类的上下文信息
 * @param meta_name meta名
 */
export declare function DeSetMetaContext(meta_name: string): (constructor: typeof MetaBase) => void;
/**
 * 获取单个的meta
 * @param meta_class
 * @param id
 */
export declare function get_meta<T extends typeof MetaBase>(meta_class: T, id: string): InstanceType<T>;
/**
 * 获取meta数组
 * @param meta_class
 */
export declare function get_metas<T extends typeof MetaBase>(meta_class: T): InstanceType<T>[];
/**
 * 获取所有meta的id数组
 * @param meta_class
 */
export declare function get_metas_ids<T extends typeof MetaBase>(meta_class: T): string[];
/**
 * 解析csv文件为json对象
 * @param source csv文件内容
 */
export declare function _parse_csv(source: string): {};
/**
 * 将resoueces/csv/路径下的所有csv文件，转换为同路径下的json文件
 */
export declare function parse_csv_all(): Promise<void>;
