/**
 * 数值表模块
 * - 需要在编辑器中手动将resources/csv下的csv文件生成json文件
 * - 在运行时自动初始化，载入json数据；如果不传入数据，则载入自动生成的json文件
 */

import { log, LogLevel } from "./log";
import { get_filename, load, load_res, to_editor_url } from "./tool-ccc";

/** 生成和读取的json文件 */
const JSON_FILENAME = "csv/auto-generate.json";

/** 需要使用到的正则 */
const REGS = {
  // 注释行标记
  COMMENT: /^#/,
  // 属性行标记
  HEADER: /^@/,
  // 换行符
  NEW_LINE: /\r\n/g,
  // 单行中的块拆分正则
  LINE: /(?<=,|^)(("[^"]*")+|[^,]*)(?=,|$)/g,
};

/** meta源数据 */
let metas: {};

/**
 * 在运行时载入meta数据
 * @param json json字符串数据，如果没有传入，则载入自动生成的文件
 */
export const _init_meta_async = async (json?: string) => {
  metas = json ? JSON.parse(json) : (await load_res(JSON_FILENAME, cc.JsonAsset)).json;
  log(LogLevel.NORMAL, "初始化meta模块成功，metas=", metas);
};

/** meta的基础类 */
export class MetaBase {
  /** 对应meta表的名称 */
  static meta_names: string[];
  /** 临时存储的合并表，合并多个表的内容 */
  static _meta_merge;
  /** 在获取时初始化 */
  static get meta_merge() {
    if (!this._meta_merge) {
      this._meta_merge = this.meta_names.reduce((r, name) => {
        name = get_filename(name);
        r = { ...metas[name] };
        return r;
      }, {});
    }
    return this._meta_merge;
  }
  /** 是否是不存在id而使用的默认值 */
  is_default: boolean;
  /** 创建meta类实例时，对传入的单行源数据进行处理 */
  use_special(s: object) {}
  /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
  use_default(id: string) {}
}

/**
 * 设置meta类上下文的装饰器函数
 * @param meta_names meta 配置表名（推荐不附带后缀名）
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

/**
 * 解析csv文件为json对象
 * @param source csv文件内容
 */
export const _parse_csv = (source: string): {} => {
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
          let fix_piece = pieces[index]?.trim().replace(/^"|"$/g, "").replace(/""/g, '"') ?? "";
          return [header, fix_piece];
        }),
      );
    }
    return result;
  }, {});
};

/**
 * 将resoueces/csv/路径下的所有csv文件，转换为同路径下的json文件
 */
export const parse_csv_all = async () => {
  let url_target = to_editor_url(JSON_FILENAME);
  let url_source = to_editor_url(cc.path.dirname(JSON_FILENAME) + "/*.csv");
  let files: Partial<Editor.assetdb.TypeAssetInfo>[] = await new Promise(res => {
    Editor.assetdb.queryAssets(url_source, "text", (err, results) => res(results));
  });
  let file_texts: cc.TextAsset[] = await Promise.all(
    files.map(file => load({ type: "uuid", uuid: file.uuid })),
  );
  let json = file_texts.reduce((r, text) => {
    r[text.name] = _parse_csv(text.text);
    return r;
  }, {});
  Editor.assetdb.createOrSave(url_target, JSON.stringify(json), (err: any) => {
    err
      ? log(LogLevel.ERROR, "写入csv的总json文件失败，可能是路径问题")
      : log(LogLevel.NORMAL, "写入csv的总json文件成功");
  });
};
