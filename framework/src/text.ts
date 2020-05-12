// 多语言模块

import { event_center } from "./event"
import { get_local, set_local } from "./local"
import { get_template_string, TAG } from "./share"

/** 事件：语言更改 */
export const EVENT_LANGUAGE_CHANGE = "@event:text/language-change"

/** 语言配置 */
export interface ConfigLanguage {
    /** 默认为中文 */
    "chinese": ConfigText,
    [k: string]: ConfigText
}

/** 文字配置 */
export interface ConfigText {
    [k: string]: string
}

/** 配置 */
let languages: ConfigLanguage

/** 编辑器默认语言 */
let editor_language: string

/**
 * 在运行时初始化text模块
 * @param config
 */
export const init_text_runtime = (config: ConfigLanguage) => {
    languages = config
}

/**
 * 在编辑器中初始化text模块
 * @param config
 * @param editor 编辑器默认语言
 */
export const init_text_editor = (config: ConfigLanguage, editor: string) => {
    if (CC_EDITOR) {
        languages = config
        editor_language = editor
        !languages[editor_language] && cc.log(TAG, "无法载入编辑器text语言")
    }
}

/** 获取当前的语言key */
export const get_language = () => {
    return get_local("language")
}

/**
 * 修改当前语言
 * @param new_language
 */
export const change_language = (new_language: string) => {
    set_local("language", new_language)
    // 触发语言更改事件
    event_center.emit(EVENT_LANGUAGE_CHANGE)
}

/**
 * 获取语言数据，如果获取失败，则返回key
 * @param key
 * @param params
 */
export const get_text = (key: string, ...params: string[]) => {
    let text = CC_EDITOR
        ? languages[editor_language][key]
        : languages[get_language()][key]
    if (text) {
        return get_template_string(text, ...params)
    } else {
        cc.warn(TAG, `key不存在, key=${key}`)
        return key
    }
}
