/**
 * 多语言模块
 * - 需要在编辑器中，运行时初始化，传入2个配置数据：ConfigLanguage，编辑器语言
 */

import { event_center } from "./event";
import { get_local, set_local } from "./local";
import { log, LogLevel } from "./log";
import { get_template_string } from "./tool";

/** 事件：语言更改 */
export const EVENT_LANGUAGE_CHANGE = "text/language-change";

/**
 * 语言配置
 * - key 表示语言
 * - value 表示语言配置文件
 */
export interface ConfigLanguage {
  /** 默认为中文 */
  chinese: { [k: string]: string };
  [k: string]: ConfigLanguage["chinese"];
}

/** 配置 */
let languages: ConfigLanguage;

/** 编辑器默认语言 */
let editor_language: string;

/**
 * 在编辑器中初始化 text 模块
 * @param config
 * @param editor 编辑器默认语言
 */
export function _init_text(config: ConfigLanguage = { chinese: {} }, editor: string = "chinese") {
  languages = config;
  editor_language = editor;
  !languages[editor_language] && log(LogLevel.IMPORTANT_ERROR, "无法载入编辑器text语言");
}

/** 获取当前的语言 key */
export function get_language() {
  return get_local("language");
}

/**
 * 修改当前语言
 * @param new_language
 */
export function change_language(new_language: string) {
  set_local("language", new_language);
  event_center.emit(EVENT_LANGUAGE_CHANGE);
}

/**
 * 获取语言数据，如果获取失败，则返回 key
 * @param key
 * @param params
 */
export function get_text(key: string, ...params: string[]) {
  let language = CC_EDITOR ? editor_language : get_language();
  let text = languages[language][key];
  if (text) {
    return get_template_string(text, ...params);
  } else {
    log(LogLevel.ERROR, `key不存在, key=${key}`);
    return key;
  }
}
