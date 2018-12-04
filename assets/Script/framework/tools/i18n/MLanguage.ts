import L from "../../L";
import { MLanguage_en } from "./MLanguageEn";
import { MLanguage_zh } from "./MLanguageZh";

const { ccclass, property, executeInEditMode, requireComponent } = cc._decorator
/** 语言类型 */
enum LANGUAGE_TYPE { CHINESE, ENGLISH }
/** 语言类型对应的语言数据脚本 */
const LANGUAGE_DATA = [MLanguage_zh, MLanguage_en]
const C = {
    TOOLTIP: {
        PREVIEW: '预览1次；预览完毕后置于false',
        KEY: '多语言对应的key',
    },
    /** 默认语言类型 */
    DEFAULT_TYPE: LANGUAGE_TYPE.ENGLISH,
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
export default class MLanguage extends cc.Component {

    /** 类型 */
    static get TYPE() { return LANGUAGE_TYPE }

    /** 初始化本地存储 */
    static init_l() {
        L.language = C.DEFAULT_TYPE
    }

    /**
     * 获取key对应的value并组合成为字符串
     * - 根据type的不同获取内容；type从L.language或者是C.DEFAULT_TYPE中获取
     * - 组合方式参考MLanuage.fake_template_string()
     * @param key 字符串key
     * @param param 字符串参数
     */
    static get_text(key: string, ...param): string {
        let type = Number.parseInt(L.language) || C.DEFAULT_TYPE
        let value = LANGUAGE_DATA[type][key]
        if (value === undefined) {
            value = key
            cc.warn(`[MLanguage] get a non-exist key, key=${key}`)
        }
        return MLanguage.fake_template_string(value, ...param)
    }

    /**
     * 显示一个多参数的模板字符串
     * @param template 伪模板字符串，使用{index}来表示参数，index表示参数序号
     * @param params 多个参数；注意排序
     * @example
    ```ts
    const s = 'this is {0}, and {this1} is {1}, {1}, {2}'
    const r = MLanguage.fake_template_string(s, 'param0', 'param1')
    console.log(r)
    => 'this is param0, and {this1} is param1, param1, undefined'
    ```
     */
    static fake_template_string(template: string, ...params: any[]): string {
        const reg = /\{([0-9]+?)\}/g
        return template.replace(reg, (match, index) => params[index])
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
    @property({ tooltip: C.TOOLTIP.PREVIEW })
    preview: boolean = false

    /** key；无法使用notify() */
    @property({ tooltip: C.TOOLTIP.KEY, multiline: true })
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