/**
 * 颜色模块
 * - 需要在编辑器中和运行时初始化
 */

import { log, LogLevel } from "./log";

/**
 * 颜色配置
 * - value 颜色的hex值，可以包含透明度
 */
export interface ConfigColor {
  /** 默认颜色 */
  none: string;
  [k: string]: string;
}

let colors: ConfigColor;

export function _init_color(config: ConfigColor = { none: "ffffff" }) {
  colors = config;
}

/**
 * 从配置中获取颜色，如果无颜色，则返回白色
 * @param color_key
 */
export function get_color(color_key: string): cc.Color {
  if (colors[color_key]) {
    return cc.color().fromHEX(colors[color_key]);
  } else {
    log(LogLevel.WARN, `获取color失败，key=${color_key}`);
    return cc.Color.WHITE;
  }
}
