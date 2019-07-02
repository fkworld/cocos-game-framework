import { en } from "../data/en";
import { zh } from "../data/zh";
import { G } from "./f-global";
import { L } from "./f-local";
import { FMLog } from "./fm-log";
import { FMVersion } from "./fm-version";

const { ccclass, property, requireComponent, menu } = cc._decorator
const C = {
    LANGUAGE: {
        "english": en,  // 英文
        "chinese": zh,  // 中文
    },
    EDITOR_TYPE: "english" as const,    // 编辑器语言
    DEFAULT_KEY: "enter-a-key",         // 默认key
}

/**
 * [M] 国际化-多语言
 * - 修改对应配置文件中的内容，key-value格式
 * - [支持] cc.Label,cc.RichText,cc.Sprite
 * - [用法] 将此组件挂载在对应的Label所在节点下，修改key
 * - [用法] 使用静态接口get()
 */
@ccclass
export class FMI18n extends cc.Component {

    /** 初始化本地存储 */
    static init_local() {
        L.language = C.EDITOR_TYPE
    }

    /**
     * 获取key对应的value并组合成为字符串
     * @param key
     * @param params
     */
    static get(key: keyof typeof en, ...params: string[]): string {
        let type = (FMVersion.is_editor || !L.language) ? C.EDITOR_TYPE : L.language
        if (!C.LANGUAGE[type]) {
            FMLog.warn(`$FMI18n: language-type不存在, type=${type}`)
            return ""
        }
        let value = C.LANGUAGE[type][key] || ""
        if (!value) {
            FMLog.warn(`@FMI18n: key不存在, key=${key}`)
        }
        return G.fake_template_string(value, ...params)
    }

    onLoad() {
        this.play_onload && this.update_show()
    }

    @property({ tooltip: "字符串key;无法使用notify()函数" })
    private key: string = C.DEFAULT_KEY

    @property({ tooltip: "字符串参数", type: cc.String })
    private params: string[] = []

    @property({ tooltip: "是否在onLoad()时候修改" })
    private play_onload: boolean = true

    @property({ tooltip: "编辑器操作" })
    private get do_editor() { return false }
    private set do_editor(v: boolean) {
        FMVersion.is_editor && this.update_show()
    }

    private type: "text" | "sp";                // 类型
    private c_text: cc.Label | cc.RichText;     // text相关组件
    private c_sp: cc.Sprite;                    // sp相关组件

    /** 更新显示,cc.Label,cc.RichText,cc.Sprite */
    private async update_show() {
        // 获取type和对应的组件
        if (!this.type) {
            this.c_text = this.node.getComponent(cc.Label) || this.node.getComponent(cc.RichText)
            this.c_sp = this.node.getComponent(cc.Sprite)
            if (this.c_text) { this.type = "text" }
            if (this.c_sp) { this.type = "sp" }
        }
        // 设置显示
        switch (this.type) {
            case "text": this.update_c_text(); break;
            case "sp": this.update_c_sp(); break;
            default: break;
        }
    }

    /** 更新text组件 */
    private update_c_text() {
        this.c_text.string = FMI18n.get(<any>this.key, ...this.params)
    }

    /** 更新sp,在editor模式下不更新 */
    private async update_c_sp() {
        if (FMVersion.is_editor) {
            FMLog.warn(`@FMI18n: 在editor模式下无法更新sp组件`)
            return
        }
        this.c_sp.spriteFrame = await G.load_res(FMI18n.get(<any>this.key, ...this.params), cc.SpriteFrame)
    }
}