import { DataText } from "../data/DataText";
import { FLocal } from "./FLocal";
import { FTool } from "./FTool";

/**
 * 多语言模块
 */
export namespace FText {

    /** 语言类型 */
    type TypeLanguageKey = keyof typeof DataText

    /** 文字的 key */
    export type TypeTextKey = keyof typeof DataText["chinese"]

    /** 编辑器语言 */
    const EDITOR_TYPE = "chinese" as TypeLanguageKey

    /** 获取当前的语言 key */
    export function get_language(): TypeLanguageKey {
        return FLocal.get("language") as TypeLanguageKey
    }

    /** 修改语言 */
    export function change_language(new_language: TypeLanguageKey) {
        FLocal.set("language", new_language)
    }

    /**
     * 获取语言本地化数据，如果获取失败，则返回 key
     * @param key
     * @param params
     */
    export function get_text(key: TypeTextKey, ...params: string[]): string {
        let language = CC_EDITOR ? EDITOR_TYPE : FLocal.get("language")
        let text = DataText[language][key]
        if (text) {
            return FTool.get_template_string(text, ...params)
        } else {
            cc.warn(`@FText: key不存在, key=${key}`)
            return key
        }
    }

}
