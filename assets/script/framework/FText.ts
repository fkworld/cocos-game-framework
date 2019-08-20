import { en } from "../data/text-en";
import { zh } from "../data/text-zh";
import { FLocal } from "./FLocal";
import { FLog } from "./FLog";
import { FVersion } from "./FVersion";
import { G } from "./G";


const { ccclass } = cc._decorator
const C = {
    LANGUAGE: {
        "chinese": zh,  // 中文
        "english": en,  // 英文
    },
    EDITOR_TYPE: "chinese" as "chinese",    // 编辑器语言
}

type DataTextKey = keyof typeof C.LANGUAGE["chinese"]

/**
 * [M] 国际化-多语言
 * - 修改对应配置文件中的内容，key-value格式
 * - [用法] 使用静态接口get()
 */
@ccclass
export class FText {

    /**
     * 获取key对应的value并组合成为字符串
     * @param key
     * @param params
     */
    static get(key: DataTextKey, ...params: string[]): string {
        let type = FLocal.get("language")
        if (FVersion.is_editor()) {
            type = C.EDITOR_TYPE
        }
        if (!C.LANGUAGE[type]) {
            FLog.warn(`@FText: language-type不存在, type=${type}`)
            return ""
        }
        let value = C.LANGUAGE[type][key] || ""
        if (!value) {
            FLog.warn(`@FText: key不存在, key=${key}`)
        }
        return G.fake_template_string(value, ...params)
    }

}
