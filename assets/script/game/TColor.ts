import { FColor } from "../framework/FColor";

const { ccclass, property } = cc._decorator;

/**
 * 颜色工具
 * - 不在 onLoad 中执行，因为只有一个颜色配置文件，所以在编辑器中操作保证所见即所得。
 * - 如果未来有多个颜色配置文件，则需要同 FText 一样。
 */
@ccclass
export class TColor extends cc.Component {

    @property({ tooltip: "颜色字符串" })
    private key: string = "none"

    @property({ tooltip: "编辑器操作" })
    private get E() { return false }
    private set E(v: boolean) { CC_EDITOR && this.update_color() }

    private update_color() {
        this.node.color = FColor.get_color(this.key as any)
    }
}
