/**
 * 文字数据模块
 * - 需要初始化，传入文字配置数据，编辑器默认语言，运行时默认语言
 * @see https://www.yuque.com/fengyong/game-develop-road/gepz3f
 */

import { event_center } from "./event";
import { get_local, set_local } from "./local";
import { log, LogLevel } from "./log";
import { get_template_string } from "./tool";
import { load_res_async } from "./tool-ccc";

/** 事件：语言更改 */
export const EVENT_LANGUAGE_CHANGE = "text/language-change";
/** 语言的本地存储key */
const KEY_LANGUAGE = "text/language";

/**
 * 语言配置
 * @property key 表示语言
 * @property value 表示语言配置文件
 */
export interface ConfigLanguage {
  /** 默认为中文 */
  chinese?: { [k: string]: string };
  [k: string]: ConfigLanguage["chinese"];
}

/** 语言配置：语言key，字符key，字符value */
let languages: Map<string, Map<string, string>>;
/** 编辑器默认语言 */
let language_editor: string;
/** 运行时默认语言 */
let language_runtime: string;

/**
 * 初始化文字数据模块
 * @since 1.0.0
 * @param config
 * @param editor 编辑器默认语言
 * @param runtime 运行时默认语言
 */
export function _init_text(
  config: ConfigLanguage = {},
  editor = "chinese",
  runtime = "chinese",
): void {
  languages = new Map(
    Object.entries(config).map(([key_language, config_language]) => {
      return [key_language, new Map(Object.entries(config_language))];
    }),
  );
  language_editor = editor;
  language_runtime = runtime;
  !languages.has(language_editor) && log(LogLevel.ImportantError, "无法载入编辑器语言");
  !languages.has(language_runtime) && log(LogLevel.ImportantError, "无法载入运行时语言");
}

/**
 * 获取当前的语言key
 * - 区分编辑器中和运行时
 * @since 1.0.0
 */
export function get_language(): string {
  return CC_EDITOR ? language_editor : get_local(KEY_LANGUAGE, language_runtime);
}

/**
 * 修改当前语言
 * @since 1.0.0
 * @param language_key
 */
export function change_language(language_key: string): void {
  set_local(KEY_LANGUAGE, language_key);
  event_center.emit(EVENT_LANGUAGE_CHANGE);
}

/**
 * 获取语言数据，如果获取失败，则返回key
 * @since 1.0.0
 * @param text_key
 * @param params
 */
export function get_text(text_key: string, ...params: string[]): string {
  let text = languages?.get(get_language())?.get(text_key);
  if (text) {
    return get_template_string(text, ...params);
  } else {
    log(LogLevel.Error, `key不存在, key=${text_key}`);
    return text_key;
  }
}

/**
 * 设置节点的text数据
 * - 支持3种组件，cc.Label/cc.RichText/cc.Sprite
 * @since 1.0.0
 * @param node
 * @param key
 * @param params
 */
export function set_node_text(node: cc.Node, key: string, ...params: string[]): void {
  let result = get_text(key, ...params);
  // label
  let label = node.getComponent(cc.Label);
  if (label) {
    label.string = result;
    return;
  }
  // richtext
  let richtext = node.getComponent(cc.RichText);
  if (richtext) {
    richtext.string = result;
    return;
  }
  // sprite
  let sprite = node.getComponent(cc.Sprite);
  if (sprite) {
    load_res_async(result, cc.SpriteFrame).then(v => {
      sprite.spriteFrame = v;
    });
    return;
  }
}
