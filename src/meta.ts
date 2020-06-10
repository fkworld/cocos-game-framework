import { log, LogLevel } from "./log";
import { to_editor_url, load } from "./tool-ccc";

export type ConfigMeta = {
  [meta_name: string]: {
    [id: string]: {
      [key: string]: string;
    };
  };
};

let metas: ConfigMeta;

export function _init_meta(config: ConfigMeta = {}) {
  metas = config;
}

/** meta基类，需要被继承 */
export class MetaBase {
  /** meta数据表名 */
  static meta_name: string;
  static get_meta_source(id: string = undefined) {
    let r = id ? metas?.[this.meta_name]?.[id] : metas?.[this.meta_name];
    !r && log(LogLevel.WARN, `获取meta源数据失败，meta_name=${this.meta_name}，id=${id}`);
    return r;
  }
  /** 是否是不存在id而使用的默认值 */
  is_default: boolean;
  /** 创建meta类实例时，对传入的单行源数据进行处理 */
  use_special(s: object) {}
  /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
  use_default(id: string) {
    throw new Error(`meta-id不存在，id=${id}`);
  }
}

/**
 * 设置meta类的上下文信息
 * @param meta_name meta名
 */
export function DeSetMetaContext(meta_name: string) {
  return (constructor: typeof MetaBase) => {
    constructor.meta_name = meta_name;
  };
}

/**
 * 获取单个的meta
 * @param meta_class
 * @param id
 */
export function get_meta<T extends typeof MetaBase>(meta_class: T, id: string): InstanceType<T> {
  let meta = new meta_class();
  let source = meta_class.get_meta_source(id);
  source ? meta.use_special(source) : meta.use_default(id);
  return meta as any;
}

/**
 * 获取meta数组
 * @param meta_class
 */
export function get_metas<T extends typeof MetaBase>(meta_class: T): InstanceType<T>[] {
  return Object.keys(meta_class.get_meta_source()).map(id => get_meta(meta_class, id));
}

/**
 * 获取所有meta的id数组
 * @param meta_class
 */
export function get_metas_ids<T extends typeof MetaBase>(meta_class: T): string[] {
  return Object.keys(meta_class.get_meta_source());
}

// TODO 在2.4.0中，由于资源载入方式发生变化，这里也需要进行修改

const AUTO_GENERATE_FILENAME = "csv/auto-generate.ts";

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

/**
 * 解析csv文件为json对象
 * @param source csv文件内容
 */
export function _parse_csv(source: string) {
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
}

/**
 * 将resoueces/csv/路径下的所有csv文件，转换为同路径下的json文件
 */
export async function parse_csv_all() {
  let url_target = to_editor_url(AUTO_GENERATE_FILENAME);
  let url_source = to_editor_url(cc.path.dirname(AUTO_GENERATE_FILENAME) + "/*.csv");
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
  Editor.assetdb.createOrSave(
    url_target,
    `export const CONFIG_META=${JSON.stringify(json)}`,
    (err: any) => {
      err
        ? log(LogLevel.ERROR, "生成csv的ts文件失败")
        : log(LogLevel.NORMAL, "写入csv的ts文件成功");
    },
  );
}
