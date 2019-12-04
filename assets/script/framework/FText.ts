import { DataText } from "../data/DataText";
import { FLocal } from "./FLocal";
import { FTool } from "./FTool";

const C = {
    EDITOR_TYPE: "chinese" as TypeLanguage  // 默认语言
}

/** 语言类型 */
type TypeLanguage = keyof typeof DataText

/** 文字的key */
type TypeTextKey = keyof typeof DataText["chinese"]

/**
 * [framework] 语言本地化数据管理
 */
export namespace FText {

    /** 获取当前的语言key */
    export function get_language(): TypeLanguage {
        return FLocal.get("language") as TypeLanguage
    }

    /** 修改语言 */
    export function change_language(new_language: TypeLanguage) {
        FLocal.set("language", new_language)
    }

    /**
     * 获取语言本地化数据,如果获取失败,则返回key
     * @param key
     * @param params
     */
    export function get_text(key: TypeTextKey, ...params: string[]): string {
        let language = CC_EDITOR ? C.EDITOR_TYPE : FLocal.get("language")
        let text = DataText[language][key]
        if (text) {
            return FTool.get_template_string(text, ...params)
        } else {
            cc.warn(`@FText: key不存在, key=${key}`)
            return key
        }
    }

}
