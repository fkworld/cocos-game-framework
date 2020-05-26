/**
 * 日志模块
 */

/** log 等级 */
export enum LogLevel {
  /** 开发者。 */
  DEV,
  /** 正常。 */
  NORMAL,
  /** 警告信息。发生了一些错误，一般不会导致游戏崩溃。 */
  WARN,
  /** 错误信息。发生了一些错误，可能会导致游戏崩溃。 */
  ERROR,
  /** 重大错误信息。一般需要重启游戏。 */
  IMPORTANT_ERROR,
}

/** 当前的输出等级 */
export let log_level: LogLevel;

export const _init_log = (level: LogLevel) => (log_level = level);

/**
 * 输出 log
 * - 根据给定的 log_level 输出 log 信息。
 * - console 还有很多高级用法，这里不做封装，可以直接使用。参考：https://juejin.im/post/5b586ec06fb9a04fc436c9b3#heading-13
 * @param level
 * @param params
 */
export const log = (level: LogLevel, ...params: any[]) => {
  if (level < log_level) {
    return;
  }
  switch (level) {
    case LogLevel.DEV:
    case LogLevel.NORMAL:
      return cc.log(`[${level}]:`, ...params);
    case LogLevel.WARN:
      return cc.warn(`[${level}]:`, ...params);
    case LogLevel.ERROR:
    case LogLevel.IMPORTANT_ERROR:
      return cc.error(`[${level}]:`, ...params);
  }
};
