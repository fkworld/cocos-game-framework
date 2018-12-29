import { MLanguage_en } from "./MLanguageEn";
import { MLanguage_zh } from "./MLanguageZh";
import { L } from "./L";
import { G } from "./G";

const { ccclass, property, executeInEditMode, requireComponent } = cc._decorator
/** 语言类型 */
enum TYPE { chinese, english }
/** 语言类型对应的语言数据脚本 */
const LANGUAGE_DATA = [MLanguage_zh, MLanguage_en]
const C = {
    DEFAULT_TYPE: TYPE.english,
    DEFAULT_KEY: 'enter_a_key_and_set_preview_true',
}

/**
 * [framework-M] 多语言
 * - [用法] 修改配置文件中的内容（例如LanguageEN.ts），key-value格式，并将此组件挂载在对应的Label所在节点下，修改key
 * - [用法] 静态接口get_text()
 */
@ccclass
@executeInEditMode
@requireComponent(cc.Label)
export class MLanguage extends cc.Component {

    /** 类型 */
    static get TYPE() { return TYPE }

    /** 初始化本地存储 */
    static init_l() {
        L.set_language(C.DEFAULT_TYPE)
    }

    /**
     * 获取key对应的value并组合成为字符串
     * - 根据type的不同获取内容；type从L.language或者是C.DEFAULT_TYPE中获取
     * - 组合方式参考G.fake_template_string()
     * @param key 字符串key
     * @param param 字符串参数
     */
    static get_text(key: string, ...param: any[]): string {
        let type = Number.parseInt(L.get_language()) || C.DEFAULT_TYPE
        let value = LANGUAGE_DATA[type][key]
        if (value === undefined) {
            value = key
            cc.warn(`[MLanguage] get a non-exist key, key=${key}`)
        }
        return G.fake_template_string(value, ...param)
    }

    onLoad() {
        this.update_label()
    }

    update(dt) {
        if (this.preview) {
            this.preview = false
            this.update_label()
        }
    }

    /** 预览（点击后刷新编辑器） */
    @property({ tooltip: '预览1次；预览完毕后置于false' })
    preview: boolean = false

    /** key；无法使用notify() */
    @property({ tooltip: '对应的key', multiline: true })
    key: string = C.DEFAULT_KEY

    /**
     * 更新label
     * - 目前仅支持cc.Label组件
     * @param label node中的cc.Label组件
     */
    update_label(key: string = this.key) {
        let value = MLanguage.get_text(key)
        this.node.getComponent(cc.Label).string = value === undefined ? key : value
    }
}