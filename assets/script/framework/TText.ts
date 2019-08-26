import { FLog } from "./FLog";
import { FText } from "./FText";
import { FVersion } from "./FVersion";
import { G } from "./G";

const { ccclass, property, menu } = cc._decorator;

/**
 * [T] 文字工具
 * - [支持] cc.Label,cc.RichText,cc.Sprite三种渲染组件,其中sprite通过传入资源路径的方式动态载入
 * - [用法] 将此组件挂载到相应节点下,修改key
 * - [注意] 有多个文字配置文件,所以会在onLoad时执行
 */
@ccclass
@menu("t/TText")
export class TText extends cc.Component {

    onLoad() {
        this.is_do_onload && this.update_show()
    }

    @property({ tooltip: "显示组件:cc.Label", type: cc.Label, readonly: true })
    private show_component_label: cc.Label = null

    @property({ tooltip: "显示组件:cc.RichText", type: cc.RichText, readonly: true })
    private show_component_rich_text: cc.RichText = null

    @property({ tooltip: "显示组件:cc.Sprite", type: cc.Sprite, readonly: true })
    private show_component_sprite: cc.Sprite = null

    @property({ tooltip: "编辑器操作:获取渲染组件" })
    private get E_get_show_component() { return false }
    private set E_get_show_component(v: boolean) { FVersion.is_editor() && this.get_show_component() }

    /** 获取渲染组件 */
    private get_show_component() {
        this.show_component_label = this.getComponent(cc.Label) || null
        this.show_component_rich_text = this.getComponent(cc.RichText) || null
        this.show_component_sprite = this.getComponent(cc.Sprite) || null
    }

    @property({ tooltip: "字符串key" })
    private key: string = ""

    @property({ tooltip: "字符串参数", type: cc.String })
    private params: string[] = []

    @property({ tooltip: "是否在onLoad时候修改;考虑有多个文字配置文件,默认为true" })
    private is_do_onload: boolean = true

    @property({ tooltip: "编辑器操作" })
    private get E_update_show_component() { return false }
    private set E_update_show_component(v: boolean) { FVersion.is_editor() && this.update_show() }

    /** 更新显示,cc.Label,cc.RichText,cc.Sprite */
    private async update_show() {
        if (!!this.show_component_label) {
            this.show_component_label.string = FText.get_text(<any>this.key, ...this.params)
            return
        }
        if (!!this.show_component_rich_text) {
            this.show_component_rich_text.string = FText.get_text(<any>this.key, ...this.params)
            return
        }
        if (!!this.show_component_sprite) {
            if (FVersion.is_editor()) {
                FLog.warn("@TText: sprite渲染组件不允许在editor下写入")
                return
            }
            this.show_component_sprite.spriteFrame = await G.load_res(FText.get_text(<any>this.key, ...this.params), cc.SpriteFrame)
            return
        }
    }
}
