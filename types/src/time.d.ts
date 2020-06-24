/**
 * 时间模块
 * @see https://www.yuque.com/fengyong/game-develop-road/ox9e872
 */
/**
 * 数据输入
 * @example
  // 如果为number，则表示毫秒数
  88888
  // 如果为string，则表示带单位的描述
  "99ms"; // 99毫秒
  "99s";  // 99秒
  "99m";  // 99分钟
  "99h";  // 99小时
  "99.5d";// 99.5天
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
 * 转为毫秒数
 * @since 1.0.0
 * @param source
 * @example
 */
export declare function to_ms(source: TimeInput): number;
/**
 * 转为数据组
 * @since 1.0.0
 * @param source
 */
export declare function to_time_group(source: TimeInput): TimeGroup;
/**
 * 转为格式化时间串
 * @since 1.0.0
 * @param ms 微秒数
 * @param zero 是否显示为0的值
 * @example
  to_time_format(888888888); //-> 246:54:48
  to_time_format(8888888); //-> 02:28:08
  to_time_format(88888); //-> 00:01:28
  to_time_format(88888, false); //-> 01:28
 */
export declare function to_time_format(source: TimeInput, zero?: boolean): string;
/**
 * 转为普通时间串
 * @since 1.0.0
 * @param source
 * @example
  to_time_string(1589974698751); //-> "19:38:18 GMT+0800 (中国标准时间)"
 */
export declare function to_time_string(source: TimeInput): string;
/**
 * 获取给定时间的天序号
 * @since 1.0.0
 * @param ms
 */
export declare function get_day(ms?: number): number;
export {};
