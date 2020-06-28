export * from "./audio";
export * from "./color";
export * from "./event";
export * from "./local";
export * from "./log";
export * from "./meta";
export * from "./native";
export * from "./panel";
export * from "./text";
export * from "./time";
export * from "./tool";
export * from "./tool-ccc";
export * from "./tool-node-anima";
export * from "./tool-state-machine";
export * from "./tool-state-table";
export * from "./version";

import { version } from "../package.json";
import { ConfigAudio, _init_audio } from "./audio";
import { ColorConfig, _init_color } from "./color";
import { ConfigLocal, _init_local } from "./local";
import { log, LogLevel, _init_log } from "./log";
import { ConfigMeta, _init_meta } from "./meta";
import { _init_panel } from "./panel";
import { ConfigLanguage, _init_text } from "./text";
import { ConfigVersion, ConfigVersionInfo, _init_version } from "./version";

/**
 * 框架初始化依赖配置
 */
export interface Config {
  version: ConfigVersion;
  version_info: ConfigVersionInfo;
  local: ConfigLocal;
  is_clear_local: boolean;
  color: ColorConfig;
  audio: ConfigAudio;
  music_switch: boolean;
  sound_switch: boolean;
  text: ConfigLanguage;
  meta: ConfigMeta;
  editor_language: string;
  runtime_language: string;
  panel_parent: cc.Node;
  log_level: LogLevel;
}

/** 框架版本号 */
export const VERSION = version;

/**
 * 初始化框架
 * @since 1.0.0
 * @param config
 */
export function init(config: Config): void {
  _init_log(config.log_level);
  _init_version(config.version);
  _init_local(config.local, config.is_clear_local);
  _init_text(config.text, config.editor_language, config.runtime_language);
  _init_color(config.color);
  _init_audio(config.audio, config.music_switch, config.sound_switch);
  _init_panel(config.panel_parent);
  _init_meta(config.meta);
  !CC_EDITOR && log(LogLevel.Dev, "初始化框架成功", VERSION, config);
}
