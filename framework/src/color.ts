/**
 * 颜色模块
 * - 需要在编辑器中和运行时初始化
 */

import { LogLevel, log } from "./log";

/**
 * 颜色配置
 * - value为颜色的hex值，可以包含透明度
 */
export interface ConfigColor {
  /** 默认颜色 */
  none: "FFFFFF";
  [k: string]: string;
}

/** 颜色配置表 */
let colors: ConfigColor;

/**
 * 需要在编辑器中初始化
 * @param config
 */
export const _init_color_editor = (config: ConfigColor) => {
  CC_EDITOR && (colors = config);
};

/**
 * 在运行时初始化颜色模块
 * @param config
 */
export const _init_color_runtime = (config: ConfigColor) => {
  colors = config;
  log(LogLevel.NORMAL, "初始化color模块成功，color_config=", config);
};

/**
 * 从配置中获取颜色，如果无颜色，则返回白色
 * @param color_key
 */
export const get_color = (color_key: string): cc.Color => {
  if (colors[color_key]) {
    return cc.color().fromHEX(colors[color_key]);
  } else {
    log(LogLevel.WARN, `获取color失败，key=${color_key}`);
    return cc.Color.WHITE;
  }
};
