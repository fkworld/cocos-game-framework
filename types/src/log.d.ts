/**
 * 日志模块
 * - 需要初始化，传入当前的日志输出等级
 * @see https://www.yuque.com/fengyong/game-develop-road/nr9qs9
 */
/** log等级 */
export declare enum LogLevel {
    /** 开发者。 */
    Dev = 0,
    /** 正常。 */
    Normal = 1,
    /** 警告信息。发生了一些错误，一般不会导致游戏崩溃。 */
    Warn = 2,
    /** 错误信息。发生了一些错误，可能会导致游戏崩溃。 */
    Error = 3,
    /** 重大错误信息。一般需要重启游戏。 */
    ImportantError = 4
}
/** 当前的输出等级 */
export declare let now_log_level: LogLevel;
export declare function _init_log(level: LogLevel): void;
/**
 * 输出log
 * @since 1.0.0
 * @param level
 * @param params
 * @see https://juejin.im/post/5b586ec06fb9a04fc436c9b3#heading-13 console的高级用法
 */
export declare function log(level: LogLevel, ...params: unknown[]): void;
