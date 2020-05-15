/**
 * 解析 csv 文件为 json 对象
 * @param source csv 文件内容
 */
export declare const parse_csv: (source: string) => {};
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
export declare const parse_csv_all: (path: string, target: string) => Promise<void>;
