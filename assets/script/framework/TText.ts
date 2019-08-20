import { FLog } from "./FLog";
import { FText } from "./FText";
import { FVersion } from "./FVersion";
import { G } from "./G";

const { ccclass, property, menu } = cc._decorator;

/**
 * - [支持] cc.Label,cc.RichText,cc.Sprite
 * - [用法] 将此组件挂载在对应的Label所在节点下，修改key
 */
@ccclass
@menu("t/TText")
export class TText extends cc.Component {

    onLoad() {
        this.play_onload && this.update_show()
    }

    @property({ tooltip: "字符串key;无法使用notify()函数" })
    private key: string = ""

    @property({ tooltip: "字符串参数", type: cc.String })
    private params: string[] = []

    @property({ tooltip: "是否在onLoad()时候修改" })
    private play_onload: boolean = true

    @property({ tooltip: "编辑器操作" })
    private get do_editor() { return false }
    private set do_editor(v: boolean) {
        FVersion.is_editor() && this.update_show()
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
        this.c_text.string = FText.get_text(<any>this.key, ...this.params)
    }

    /** 更新sp,在editor模式下不更新 */
    private async update_c_sp() {
        if (FVersion.is_editor()) {
            FLog.warn(`@FText: 在editor模式下无法更新sp组件`)
            return
        }
        this.c_sp.spriteFrame = await G.load_res(FText.get_text(<any>this.key, ...this.params), cc.SpriteFrame)
    }
}
