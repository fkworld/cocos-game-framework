import { FEvent } from "./FEvent";
import { FLocal } from "./FLocal";
import { FTool } from "./FTool";

/**
 * 多语言模块
 * - 使用key-value形式
 * - 不同语言对应不同的语言配置文件（或json）
 * - 【注意】需要在对应的配置文件中调用init_editor()方法，来保证可以在编辑器中使用
 */
export namespace FText {

    /** 输出log */
    const TAG = "@FText:"

    /** 事件：语言更改 */
    export const EVENT_LANGUAGE_CHANGE = "@FText/language_change"

    /** 语言配置 */
    export interface ConfigLanguage {
        [k: string]: ConfigText
    }

    /** 文字配置 */
    export interface ConfigText {
        [k: string]: string
    }

    /**
     * 需要在app中初始化
     * @param config_language 语言配置
     */
    export const init = (config_language: ConfigLanguage) => {
        data_runtime = config_language
    }

    /**
     * 在编辑器中初始化
     * @param config_text
     */
    export const init_editor = (config_text: ConfigText) => {
        CC_EDITOR && (data_editor = config_text)
    }

    /** 运行时配置 */
    let data_runtime: ConfigLanguage

    /** 编辑器配置 */
    let data_editor: ConfigText

    /** 获取当前的语言key */
    export const get_language = () => {
        return FLocal.get("language")
    }

    /**
     * 修改当前语言
     * @param new_language
     */
    export const change_language = (new_language: string) => {
        FLocal.set("language", new_language)
        // 触发语言更改事件
        FEvent.center.emit(EVENT_LANGUAGE_CHANGE)
    }

    /**
     * 获取语言数据，如果获取失败，则返回key
     * @param key
     * @param params
     */
    export const get_text = (key: string, ...params: string[]) => {
        if (CC_EDITOR && !data_editor) {
            cc.error(TAG, "未在编辑器中初始化，请初始化")
            return key
        }
        let text = CC_EDITOR
            ? data_editor[key]
            : data_runtime[get_language()][key]
        if (text) {
            return FTool.get_template_string(text, ...params)
        } else {
            cc.warn(TAG, `key不存在, key=${key}`)
            return key
        }
    }

}
