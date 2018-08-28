import LanguageZH from "./LanguageZH";
import LanguageEN from "./LanguageEn";
import L from "../../LocalData";

const { ccclass, property, executeInEditMode, requireComponent } = cc._decorator

/**
 * 框架文件：Label本地化组件
 * - 用法：修改LanguageZH.js中的内容，key-value格式，并将此组件挂载在对应的Label所在节点下，修改key
 */
@ccclass
@executeInEditMode
@requireComponent(cc.Label)
export default class MLanguage extends cc.Component {

    /** 预览（点击后刷新编辑器） */
    @property({ tooltip: "预览" })
    preview = false

    /** key */
    @property({
        tooltip: "本地key",
        multiline: true,
        // notify: () => { }, // 会报错：not yet support notify attribute for ES6 Classes
    })
    key = "输入一个key"

    start() {
        this.update_label()
    }

    update(dt) {
        if (this.preview) {
            this.preview = false
            this.update_label()
        }
    }

    /** 更新label */
    update_label() {
        let value = MLanguage.get_text(this.key)
        let label = this.node.getComponent(cc.Label)
        if (value === undefined) {
            label.string = this.key
        } else {
            label.string = value
        }
    }

    /**
     * 获取text数值
     * @param {string} key 
     * @returns {undefined | string}
     */
    static get_text(key) {
        let value;
        switch (L.language) {
            case "chinese":
                value = LanguageZH[key]
                break
            case "english":
                value = LanguageEN[key]
                break
            default:
                // 默认为中文
                value = LanguageZH[key]
                break
        }
        if (value === undefined) {
            cc.warn("[注意] 获取了一个不存在的本地字符串，key=", key)
        }
        return value
    }
}