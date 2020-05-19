import { event_center } from "./event";

/** 事件：输出一条 dev */
export const EVENT_LOG_DEV = "@event:log/dev";
/** 事件：输出一条 normal */
export const EVENT_LOG_NORMAL = "@event:log/normal";
/** 事件：输出一条 warn */
export const EVENT_LOG_WARN = "@event:log/warn";
/** 事件：输出一条 error */
export const EVENT_LOG_ERROR = "@event:log/error";
/** 事件：输出一条 important error */
export const EVENT_LOG_IMPORTANT_ERROR = "@event:log/important-error";

/**
 * log 等级
 */
export const enum LogLevel {
  /** 开发者，仅供开发者查看。 */
  DEV,
  /** 正常 */
  NORMAL,
  /** 警告信息。发生了一些错误，但这些错误可能不重要。 */
  WARN,
  /** 错误信息。 */
  ERROR,
  /** 重大错误信息。一般伴随着游戏重启。 */
  IMPORTANT_ERROR,
}

/** 输出等级对应的事件名 */
const events = new Map([
  [LogLevel.DEV, EVENT_LOG_DEV],
  [LogLevel.NORMAL, EVENT_LOG_NORMAL],
  [LogLevel.WARN, EVENT_LOG_WARN],
  [LogLevel.ERROR, EVENT_LOG_ERROR],
  [LogLevel.IMPORTANT_ERROR, EVENT_LOG_IMPORTANT_ERROR],
]);

/** 当前的输出等级 */
let log_level: LogLevel;

/**
 * 初始化 log 模块
 * @param level 输出等级，大于等于此等级时，会输出。默认为 NORMAL。
 */
export const _init_log = (level: LogLevel) => {
  log_level = level ?? LogLevel.NORMAL;
};

/**
 * 输出 log
 * - 根据给定的 log_level 输出 log 信息。
 * - console 有很多高级用法，这里不做封装，可以直接使用。参考：https://juejin.im/post/5b586ec06fb9a04fc436c9b3#heading-13
 * @param level
 * @param params
 */
export const log = (level: LogLevel, ...params: any[]) => {
  // 均触发事件
  event_center.emit(events.get(level));
  // 低于输出等级不输出
  if (level < log_level) {
    return;
  } else {
    switch (level) {
      case LogLevel.DEV:
      case LogLevel.NORMAL:
        return console.log(`[${level}]:`, ...params);
      case LogLevel.WARN:
        return console.log(`[${level}]:`, ...params);
      case LogLevel.ERROR:
      case LogLevel.IMPORTANT_ERROR:
        return console.log(`[${level}]:`, ...params);
    }
  }
};
