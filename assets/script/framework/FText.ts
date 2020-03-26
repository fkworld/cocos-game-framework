import { DataTextDefault, DataLanguage } from "../data/DataText";
import { FLocal } from "./FLocal";
import { FTool } from "./FTool";

/**
 * 多语言模块
 */
export namespace FText {

    /** 文字的 key */
    export type TextKey = keyof typeof DataTextDefault

    /** 语言的 key */
    export type TypeLanguage = keyof typeof DataLanguage

    /** 获取当前的语言 key */
    export function get_language(): TypeLanguage {
        if (CC_EDITOR) {
            return "chinese"
        } else {
            return FLocal.get("language") as TypeLanguage
        }
    }

    /** 修改语言 */
    export function change_language(new_language: string) {
        FLocal.set("language", new_language)
    }

    /**
     * 获取语言本地化数据，如果获取失败，则返回 key
     * @param key
     * @param params
     */
    export function get_text(key: TextKey, ...params: string[]): string {
        let text = DataLanguage[get_language()][key]
        if (text) {
            return FTool.get_template_string(text, ...params)
        } else {
            cc.warn(`@FText: key不存在, key=${key}`)
            return key
        }
    }

}
