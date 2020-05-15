import { TAG } from "./tool";
import { to_editor_url, load } from "./tool-ccc";

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

/**
 * 解析 csv 文件为 json 对象
 * @param source csv 文件内容
 */
export const parse_csv = (source: string): {} => {
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
        })
      );
    }
    return result;
  }, {});
};

/**
 * 将 resoueces/path 路径下的所有 csv 文件，转换为同路径下的 json 文件
 * - 【注意】需要在编辑器中执行，执行会覆盖输出文件
 * - 【注意】必须是在根路径下的 csv 文件
 * @param path 需要在 resouces 路径下
 * @param target 需要以 .json 结尾
 * @example
 * ```
 * parse_csv_all("csv", "all.json");
 * ```
 */
export const parse_csv_all = async (path: string, target: string) => {
  let url_source = (cc.path.join as any)(to_editor_url(path), "*.csv");
  let url_target = (cc.path.join as any)(to_editor_url(path), target);
  let files: Partial<Editor.assetdb.TypeAssetInfo>[] = await new Promise(res => {
    Editor.assetdb.queryAssets(url_source, "text", (err, results) => res(results));
  });
  let file_texts: cc.TextAsset[] = await Promise.all(
    files.map(file => load({ type: "uuid", uuid: file.uuid }))
  );
  let json = file_texts.reduce((r, text) => {
    r[text.name] = parse_csv(text.text);
    return r;
  }, {});
  Editor.assetdb.createOrSave(url_target, JSON.stringify(json), (err: any) => {
    err ? cc.warn(TAG, "写入csv的总json文件失败") : cc.log(TAG, "写入csv的总json文件成功");
  });
};
