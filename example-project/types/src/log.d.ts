/**
 * 日志模块
 */
/** log等级 */
export declare enum LogLevel {
    /** 开发者。 */
    DEV = 0,
    /** 正常。 */
    NORMAL = 1,
    /** 警告信息。发生了一些错误，一般不会导致游戏崩溃。 */
    WARN = 2,
    /** 错误信息。发生了一些错误，可能会导致游戏崩溃。 */
    ERROR = 3,
    /** 重大错误信息。一般需要重启游戏。 */
    IMPORTANT_ERROR = 4
}
/** 当前的输出等级 */
export declare let log_level: LogLevel;
export declare const _init_log: (level: LogLevel) => void;
/**
 * 输出log
 * - 根据给定的log_level输出log信息。
 * - console还有很多高级用法，这里不做封装，可以直接使用。参考：https://juejin.im/post/5b586ec06fb9a04fc436c9b3#heading-13
 * @param level
 * @param params
 */
export declare function log(level: LogLevel, ...params: any[]): void;
