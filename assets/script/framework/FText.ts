import { en, TypeI18n } from "../data/en";
import { zh } from "../data/zh";
import { FLog } from "./FLog";
import { FVersion } from "./FVersion";
import { G } from "./G";
import { L } from "./L";


const { ccclass, property, requireComponent, menu } = cc._decorator
const C = {
    LANGUAGE: {
        "english": en,  // 英文
        "chinese": zh,  // 中文
    },
    EDITOR_TYPE: "english" as const,    // 编辑器语言
}

/**
 * [M] 国际化-多语言
 * - 修改对应配置文件中的内容，key-value格式
 * - [用法] 使用静态接口get()
 */
@ccclass
export class FText {

    /** 初始化本地存储 */
    static init_local() {
        L.language = C.EDITOR_TYPE
    }

    /**
     * 获取key对应的value并组合成为字符串
     * @param key
     * @param params
     */
    static get(key: keyof TypeI18n, ...params: string[]): string {
        let type = (FVersion.is_editor() || !L.language) ? C.EDITOR_TYPE : L.language
        if (!C.LANGUAGE[type]) {
            FLog.warn(`$FText: language-type不存在, type=${type}`)
            return ""
        }
        let value = C.LANGUAGE[type][key] || ""
        if (!value) {
            FLog.warn(`@FText: key不存在, key=${key}`)
        }
        return G.fake_template_string(value, ...params)
    }

}