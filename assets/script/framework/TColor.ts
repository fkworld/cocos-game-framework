import { FColor } from "./FColor";

const { ccclass, property, menu } = cc._decorator;
const C = {
    DEFAULT_KEY: "none",    // 默认key;对应颜色为白色
}

/**
 * [T] 颜色工具
 * - [注意] 不在onLoad中执行,需要手动在编辑器中preview;如果未来有多个颜色配置文件,则需要在onLoad中执行.
 */
@ccclass
@menu("t/TColor")
export class TColor extends cc.Component {

    @property({ tooltip: "颜色字符串" })
    private key: string = C.DEFAULT_KEY

    @property({ tooltip: "编辑器操作" })
    private get E() { return false }
    private set E(v: boolean) { CC_EDITOR && this.update_color() }

    private update_color() {
        this.node.color = FColor.get_color(<any>this.key)
    }
}
