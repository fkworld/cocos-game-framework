export * from "./audio";
export * from "./color";
export * from "./csv";
export * from "./event";
export * from "./local";
export * from "./meta";
export * from "./native";
export * from "./panel";
export * from "./state-node-anima";
export * from "./state-sfsm";
export * from "./state-table";
export * from "./text";
export * from "./tool";
export * from "./tool-ccc";
export * from "./tool-random";
export * from "./version";

import { ConfigAudio, _init_audio_runtime } from "./audio";
import { ConfigColor, _init_color_editor, _init_color_runtime } from "./color";
import { ConfigLocal, _init_local_runtime } from "./local";
import { _init_meta_editor_async, _init_meta_runtime_async } from "./meta";
import { _init_panel_runtime } from "./panel";
import { ConfigLanguage, _init_text_editor, _init_text_runtime } from "./text";
import { TAG } from "./tool";
import {
  ConfigVersion,
  ConfigVersionInfo,
  _init_version_editor,
  _init_version_runtime,
} from "./version";

/** 当前版本号 */
export const VERSION = "1.0.0";

/** 当前版本时间 */
export const VERSION_TIME = "2020.5.11";

/** 框架初始化依赖配置 */
export interface Config {
  version: ConfigVersion;
  version_info: ConfigVersionInfo;
  local: ConfigLocal;
  color: ConfigColor;
  audio: ConfigAudio;
  text: ConfigLanguage;
  editor_language: string;
  meta_json_file: string;
  panel_parent: cc.Node;
}

/**
 * 在编辑器中初始化框架
 * @param config
 */
export const init_editor = async (config: Config) => {
  // 注意初始化次序
  _init_version_editor(config.version);
  _init_text_editor(config.text, config.editor_language);
  _init_color_editor(config.color);
  await _init_meta_editor_async(config.meta_json_file);
};

/**
 * 在运行时初始化框架
 * @param config
 */
export const init_runtime = async (config: Config) => {
  // 注意初始化次序
  _init_version_runtime(config.version, config.version_info);
  _init_local_runtime(config.local);
  _init_text_runtime(config.text);
  _init_color_runtime(config.color);
  _init_audio_runtime(config.audio);
  _init_panel_runtime(config.panel_parent);
  await _init_meta_runtime_async(config.meta_json_file);
  cc.log(TAG, "初始化框架成功", VERSION, VERSION_TIME);
};
