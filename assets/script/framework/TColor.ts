import { MVersion } from "./MVersion";
import { color } from "../data/color";

const { ccclass, property, executeInEditMode, menu } = cc._decorator;
const C = {
    COLOR: color,            // 数据
    DEFAULT_KEY: "none",    // 默认key;对应颜色为白色
}

/**
 * [T] 颜色工具
 * - [注意] 不在onLoad()时执行，需要手动在编辑器中preview
 * - [参考资料] Ant-design推荐的颜色设计:https://ant.design/docs/spec/colors-cn
 */
@ccclass
@executeInEditMode
@menu("framework/TColor")
export class TColor extends cc.Component {

    update() {
        if (MVersion.run_editor && this.preview) {
            this.preview = false
            this.node.color = C.COLOR[this.key]
        }
    }

    @property({ tooltip: "颜色字符串" })
    private key: string = C.DEFAULT_KEY

    @property({ tooltip: "预览" })
    private preview: boolean = false

}