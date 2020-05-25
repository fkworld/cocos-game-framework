/**
 * 时间模块
 * - 缩写
 *    - MS 毫秒
 *    - S 秒
 *    - M 分钟
 *    - H 小时
 *    - D 天
 */
/**
 * 数据输入
 * @example
 * ```
 * // 如果为number，则表示毫秒数
 * 88888
 * // 如果为string，则表示带单位的描述
 * "99ms";
 * "99s";
 * "99m";
 * "99h";
 * "99.5d";
 * ```
 */
declare type TimeInput = string | number;
/**
 * 数据组
 * - 带 _fix 后缀的表示经过模处理之后的数值
 */
interface TimeGroup {
    ms: number;
    ms_fix: number;
    s: number;
    s_fix: number;
    m: number;
    m_fix: number;
    h: number;
    h_fix: number;
}
/** 1s = 1000ms */
export declare const S_MS = 1000;
/** 1min = 60000ms */
export declare const M_MS: number;
/** 1hour = 3600000ms */
export declare const H_MS: number;
/** 1day = 86400000ms */
export declare const D_MS: number;
/**
 * 将字符串转为毫秒
 * @param source
 * @example
 */
export declare const to_ms: (source: TimeInput) => number;
export declare const to_group: (source: TimeInput) => TimeGroup;
/**
 * 将给定微秒数格式化
 * @param ms 微秒数
 * @param zero 是否显示为 0 的值
 * @example
 * ```
 * to_show(888888888); //-> 246:54:48
 * to_show(8888888); //-> 02:28:08
 * to_show(88888); //-> 00:01:28
 * to_show(88888, false); //-> 01:28
 * ```
 */
export declare const to_show: (source: TimeInput, zero?: boolean) => string;
/**
 * 显示为时间字符串
 * @param source
 * @example
 * ```
 * to_timestring(1589974698751); //-> "19:38:18 GMT+0800 (中国标准时间)"
 * ```
 */
export declare const to_timestring: (source: TimeInput) => string;
/**
 * 获取给定时间的天序号
 * @param ms
 */
export declare const get_day: (ms?: number) => number;
export {};
