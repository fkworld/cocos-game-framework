import { en } from "../data/text-en";
import { zh } from "../data/text-zh";
import { FLocal } from "./FLocal";
import { FLog } from "./FLog";
import { FVersion } from "./FVersion";
import { G } from "./G";

const C = {
    LANGUAGE: {
        "chinese": zh,  // 中文
        "english": en,  // 英文
    },
    EDITOR_TYPE: "chinese" as "chinese",    // 编辑器语言
}

/** 语言的所有key */
type DataTextKey = keyof typeof C.LANGUAGE["chinese"]

/**
 * [framework] 语言本地化数据管理
 */
export namespace FText {

    /**
     * 获取语言本地化数据,如果获取失败,则返回key
     * @param key
     * @param params
     */
    export function get_text(key: DataTextKey, ...params: string[]): string {
        let type = FLocal.get("language")
        if (FVersion.is_editor()) {
            type = C.EDITOR_TYPE
        }
        if (!C.LANGUAGE[type]) {
            FLog.warn(`@FText: language-type不存在, type=${type}`)
            return key
        }
        if (!C.LANGUAGE[type][key]) {
            FLog.warn(`@FText: key不存在, key=${key}`)
            return key
        } else {
            return G.get_template_string(C.LANGUAGE[type][key], ...params)
        }
    }

}
