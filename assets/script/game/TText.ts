import { FText, TypeTextKey } from "../framework/FText";
import { FTool } from "../framework/FTool";

const { ccclass, property } = cc._decorator;

/**
 * 文字工具
 * - 支持 cc.Label cc.RichText cc.Sprite 三种不同的组件。
 */
@ccclass
export class TText extends cc.Component {

    onLoad() {
        this.is_do_onload && this.update_show()
    }

    @property({ tooltip: "字符串key" })
    private key: TypeTextKey = "none"

    @property({ tooltip: "字符串参数" })
    private params: string[] = []

    @property({ tooltip: "是否在onLoad时候修改，默认为true" })
    private is_do_onload: boolean = true

    @property({ tooltip: "编辑器操作" })
    private get E() { return false }
    private set E(v: boolean) { CC_EDITOR && this.update_show() }

    /** 更新显示 */
    private async update_show() {
        // cc.Label
        if (this.getComponent(cc.Label)) {
            this.getComponent(cc.Label).string = FText.get_text(this.key, ...this.params)
            return
        }
        // cc.RichText
        if (this.getComponent(cc.RichText)) {
            this.getComponent(cc.RichText).string = FText.get_text(this.key, ...this.params)
            return
        }
        // cc.Sprite
        if (this.getComponent(cc.Sprite)) {
            let editor_path = FText.get_text(this.key, ...this.params)
            // 运行时载入需要对path进行进一步处理
            let runtime_path = editor_path.replace(/\..*$/, "")
            this.getComponent(cc.Sprite).spriteFrame = CC_EDITOR
                ? await FTool.load_res_in_editot(editor_path, cc.SpriteFrame)
                : await FTool.load_res(runtime_path, cc.SpriteFrame)
        }
    }
}
