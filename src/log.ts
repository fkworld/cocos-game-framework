/**
 * 日志模块
 * - 需要初始化，传入当前的日志输出等级
 * @see https://www.yuque.com/fengyong/game-develop-road/nr9qs9
 */

/** log等级 */
export enum LogLevel {
  /** 开发者。 */
  Dev,
  /** 正常。 */
  Normal,
  /** 警告信息。发生了一些错误，一般不会导致游戏崩溃。 */
  Warn,
  /** 错误信息。发生了一些错误，可能会导致游戏崩溃。 */
  Error,
  /** 重大错误信息。一般需要重启游戏。 */
  ImportantError,
}

/** 当前的输出等级 */
export let now_log_level: LogLevel;

export function _init_log(level: LogLevel): void {
  now_log_level = level;
}

/**
 * 输出log
 * @since 1.0.0
 * @param level
 * @param params
 * @see https://juejin.im/post/5b586ec06fb9a04fc436c9b3#heading-13 console的高级用法
 */
export function log(level: LogLevel, ...params: unknown[]): void {
  if (level < now_log_level) {
    return;
  }
  switch (level) {
    case LogLevel.Dev:
    case LogLevel.Normal:
      return cc.log(`[${LogLevel[level]}]:`, ...params);
    case LogLevel.Warn:
      return cc.warn(`[${LogLevel[level]}]:`, ...params);
    case LogLevel.Error:
    case LogLevel.ImportantError:
      return cc.error(`[${LogLevel[level]}]:`, ...params);
  }
}
