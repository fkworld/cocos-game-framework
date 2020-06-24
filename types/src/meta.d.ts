/**
 * 数据表模块
 * - 需要初始化，传入配置数据
 * @see https://www.yuque.com/fengyong/game-develop-road/wo07pz
 * @todo 修改从csv到ts文件的处理方法
 */
/**
 * meta配置信息，一般是通过csv文件自动生成
 */
export declare type ConfigMeta = {
    [metaName: string]: {
        [id: string]: {
            [key: string]: string;
        };
    };
};
/**
 * 初始化
 * @since 1.0.0
 * @param config
 */
export declare function _init_meta(config?: ConfigMeta): void;
/**
 * meta基类
 * @since 1.0.0
 * @example
  &#64;fy.DeSetMetaContext("MetaExample")
  export class MetaExample extends fy.MetaBase {
    use_special(_s: unknown): void {
      this.id = _s["id"];
      this.age = Number.parseInt(_s["age"]);
    }
    id: string;
    age: number;
  }
 */
export declare class MetaBase {
    /** meta数据表名 */
    static meta_name: string;
    /**
     * 获取完整表数据
     * @since 1.0.0
     */
    static _get_meta_source_all(): ConfigMeta[""];
    /**
     * 获取表内单个id的数据
     * @since
     * @param id
     */
    static _get_meta_source_by_id(id: string): ConfigMeta[""][""];
    /** 是否是不存在id而使用的默认值 */
    is_default: boolean;
    /**
     * 创建meta类实例时，对传入的单行源数据进行处理
     * @since 1.0.0
     */
    use_special(_s: unknown): void;
    /**
     * 创建meta类实例时，如果没有源数据，则设置为给定的默认值
     * @since 1.0.0
     */
    use_default(id: string): void;
}
/**
 * 装饰器函数：设置meta类的上下文信息
 * @since 1.0.0
 * @param meta_name
 */
export declare function DE_SET_META_CONTEXT(meta_name: string): (constructor: typeof MetaBase) => void;
/**
 * 获取单个的meta
 * @since 1.0.0
 * @param meta_class
 * @param id
 */
export declare function get_meta<T extends typeof MetaBase>(meta_class: T, id: string): InstanceType<T>;
/**
 * 获取meta数组
 * @since 1.0.0
 * @param meta_class
 */
export declare function get_metas<T extends typeof MetaBase>(meta_class: T): InstanceType<T>[];
/**
 * 获取所有meta的id数组
 * @since 1.0.0
 * @param meta_class
 */
export declare function get_metas_id<T extends typeof MetaBase>(meta_class: T): string[];
/**
 * 解析csv文件为json对象
 * @since 1.0.0
 * @param source csv文件内容
 * @description 需要修改csv到ts文件的方法
 */
export declare function _parse_csv(source: string): Record<string, unknown>;
/**
 * 将resoueces/csv/路径下的所有csv文件，转换为同路径下的ts文件
 * @since 1.0.0
 * @description 需要修改csv到ts文件的方法
 * @example
  &#64;property({ tooltip: "点击创建json文件" })
  private get E() {
    return false;
  }
  private set E(v: boolean) {
    CC_EDITOR && fy.parse_csv_all();
  }
 */
export declare function parse_csv_all(): Promise<void>;
