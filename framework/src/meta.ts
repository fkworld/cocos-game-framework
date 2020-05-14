// 数据配置表模块

import { load_res } from "./tool-ccc";
import { TAG } from "./tool";

/** meta源数据 */
let metas: object;

/**
 * 在编辑器中载入meta数据
 * @param file
 */
export const _init_meta_editor_async = async (file: string) => {
  CC_EDITOR && (metas = (await load_res(file, cc.JsonAsset)).json);
};

/**
 * 在运行时载入meta数据
 * @param file
 */
export const _init_meta_runtime_async = async (file: string) => {
  metas = (await load_res(file, cc.JsonAsset)).json;
  cc.log(TAG, "初始化meta模块成功，metas=", metas);
};

/** meta的基础类 */
export class MetaBase {
  /** 对应meta表的名称 */
  static meta_names: string[];
  /** 临时存储的合并表，合并多个表的内容 */
  static _meta_merge = null;
  /** 在获取时初始化 */
  static get meta_merge() {
    if (!this._meta_merge) {
      this._meta_merge = this.meta_names.reduce((r, name) => {
        r = { ...metas[name] };
        return r;
      }, {});
    }
    return this._meta_merge;
  }
  /** 是否是不存在id而使用的默认值 */
  is_default: boolean;
  /** 创建meta类实例时，对传入的单行源数据进行处理 */
  use_special(s: object): void {}
  /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
  use_default(id: string): void {}
}

/**
 * 设置meta类上下文的装饰器函数
 * @param meta_names
 */
export const DeSetMetaContext = (...meta_names: string[]) => {
  return (constructor: typeof MetaBase) => {
    constructor.meta_names = meta_names;
  };
};

/**
 * 获取单个的meta
 * @param meta_class
 * @param id
 */
export const get_meta = <T extends typeof MetaBase>(meta_class: T, id: string): InstanceType<T> => {
  let meta = new meta_class();
  let source = meta_class.meta_merge[id];
  source ? meta.use_special(source) : meta.use_default(id);
  return meta as any;
};

/**
 * 获取meta数组
 * @param meta_class
 */
export const get_metas = <T extends typeof MetaBase>(meta_class: T): InstanceType<T>[] => {
  return Object.keys(meta_class.meta_merge).map(id => get_meta(meta_class, id));
};

/**
 * 获取所有meta的id数组
 * @param meta_class
 */
export const get_metas_ids = <T extends typeof MetaBase>(meta_class: T): string[] => {
  return Object.keys(meta_class.meta_merge);
};
