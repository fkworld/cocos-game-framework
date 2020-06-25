/**
 * 数据表模块
 * - 需要初始化，传入配置数据
 * @see https://www.yuque.com/fengyong/game-develop-road/wo07pz
 * @todo 修改从csv到ts文件的处理方法
 */

import { log, LogLevel } from "./log";
import { load_dir_async, to_editor_url } from "./tool-ccc";

/**
 * meta配置信息，一般是通过csv文件自动生成
 */
export type ConfigMeta = {
  [metaName: string]: {
    [id: string]: {
      [key: string]: string;
    };
  };
};

let metas: ConfigMeta;

/**
 * 初始化
 * @since 1.0.0
 * @param config
 */
export function _init_meta(config: ConfigMeta = {}): void {
  metas = config;
}

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
export class MetaBase {
  /** meta数据表名 */
  static meta_name: string;

  /**
   * 获取完整表数据
   * @since 1.0.0
   */
  static _get_meta_source_all(): ConfigMeta[""] {
    return metas?.[this.meta_name];
  }

  /**
   * 获取表内单个id的数据
   * @since
   * @param id
   */
  static _get_meta_source_by_id(id: string): ConfigMeta[""][""] {
    return metas?.[this.meta_name]?.[id];
  }

  /** 是否是不存在id而使用的默认值 */
  is_default: boolean;

  /**
   * 创建meta类实例时，对传入的单行源数据进行处理
   * @since 1.0.0
   */
  use_special(_s: unknown): void {}

  /**
   * 创建meta类实例时，如果没有源数据，则设置为给定的默认值
   * @since 1.0.0
   */
  use_default(id: string): void {
    throw new Error(`meta-id不存在，id=${id}`);
  }
}

/**
 * 装饰器函数：设置meta类的上下文信息
 * @since 1.0.0
 * @param meta_name
 */
export function DE_SET_META_CONTEXT(meta_name: string) {
  return (constructor: typeof MetaBase): void => {
    constructor.meta_name = meta_name;
  };
}

/**
 * 获取单个的meta
 * @since 1.0.0
 * @param meta_class
 * @param id
 */
export function get_meta<T extends typeof MetaBase>(meta_class: T, id: string): InstanceType<T> {
  let meta = new meta_class();
  let source = meta_class._get_meta_source_by_id(id);
  source ? meta.use_special(source) : meta.use_default(id);
  return meta as any;
}

/**
 * 获取meta数组
 * @since 1.0.0
 * @param meta_class
 */
export function get_metas<T extends typeof MetaBase>(meta_class: T): InstanceType<T>[] {
  return get_metas_id(meta_class).map(id => get_meta(meta_class, id));
}

/**
 * 获取所有meta的id数组
 * @since 1.0.0
 * @param meta_class
 */
export function get_metas_id<T extends typeof MetaBase>(meta_class: T): string[] {
  return Object.keys(meta_class._get_meta_source_all());
}

/** 自动生成的文件名 */
const AUTO_GENERATE_FILENAME = "csv/auto-generate.ts";

const REGS = {
  /** 注释行标记 */
  COMMENT: /^#/,
  /** 属性行标记 */
  HEADER: /^@/,
  /** 换行符 */
  NEW_LINE: /\r\n/g,
  /**
   * 单行中的块拆分正则
   * @see https://github.com/fkworld/cocos-game-framework/issues/50
   * @todo 由于部分浏览器不支持环视，这里会导致在导出为web时出现解析错误
   */
  LINE: /(?<=,|^)(("[^"]*")+|[^,]*)(?=,|$)/g,
};

/**
 * 解析csv文件为json对象
 * @since 1.0.0
 * @param source csv文件内容
 * @description 需要修改csv到ts文件的方法
 */
export function _parse_csv(source: string): Record<string, unknown> {
  // 属性行
  let headers: string[] = [];
  // 拆分行
  let lines = source.trim().split(REGS.NEW_LINE);
  // 处理行
  return lines.reduce((result, line) => {
    line = line.trim();
    if (REGS.COMMENT.test(line) || line === "") {
      // 跳过不处理的行
    } else if (REGS.HEADER.test(line)) {
      // 属性行处理
      headers = line.match(REGS.LINE);
      headers[0] = headers[0].replace(REGS.HEADER, "");
    } else {
      // 内容行处理
      let pieces = line.match(REGS.LINE);
      result[pieces[0]] = Object.fromEntries(
        headers.map((header, index) => {
          let piece_fix = pieces[index]?.trim().replace(/^"|"$/g, "").replace(/""/g, '"') ?? "";
          return [header, piece_fix];
        }),
      );
    }
    return result;
  }, {});
}

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
export async function parse_csv_all(): Promise<void> {
  let file_texts = await load_dir_async("csv", cc.TextAsset);
  let json = file_texts.reduce((r, text) => {
    r[text.name] = _parse_csv(text.text);
    return r;
  }, {});
  Editor.assetdb.createOrSave(
    to_editor_url(AUTO_GENERATE_FILENAME),
    `export const CONFIG_META=${JSON.stringify(json)}`,
    (err: unknown) => {
      err
        ? log(LogLevel.Error, "生成csv的ts文件失败")
        : log(LogLevel.Normal, "写入csv的ts文件成功");
    },
  );
}
