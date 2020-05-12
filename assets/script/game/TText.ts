const { ccclass, property, executeInEditMode } = cc._decorator;

/**
 * 文字工具
 * - 支持 cc.Label cc.RichText cc.Sprite 三种不同的组件。
 */
@ccclass
@executeInEditMode
export class TText extends cc.Component {

    onLoad() {
        if (CC_EDITOR) {
            this.update_show()
            cc.log(`@TText:在编辑器中修改了文字,node=${this.node.name}`)
        } else {
            this.is_onload && this.update_show()
        }
    }

    @property({ tooltip: "字符串key" })
    private key = "none"

    @property({ tooltip: "字符串参数" })
    private params: string[] = []

    @property({ tooltip: "是否在onLoad时候修改，默认为true" })
    private is_onload: boolean = true

    @property({ tooltip: "编辑器操作" })
    private get E() { return false }
    private set E(v: boolean) { CC_EDITOR && this.update_show() }

    /** 更新显示 */
    private async update_show() {
        let result = fy.get_text(this.key as any, ...this.params)
        // cc.Label
        if (this.getComponent(cc.Label)) {
            this.getComponent(cc.Label).string = result
            return
        }
        // cc.RichText
        if (this.getComponent(cc.RichText)) {
            this.getComponent(cc.RichText).string = result
            return
        }
        // cc.Sprite
        if (this.getComponent(cc.Sprite)) {
            this.getComponent(cc.Sprite).spriteFrame = await fy.load_res(result, cc.SpriteFrame)
        }
    }
}
