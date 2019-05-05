import { MVersion } from "./MVersion";

const { ccclass, property, executeInEditMode, menu } = cc._decorator;

/** 颜色分类 */
enum TYPE {
    none,
    cyan_6, cyan_7, cyan_8, cyan_9, cyan_10,
    volcano_6, volcano_7, volcano_8, volcano_9, volcano_10,
}
const C = {
    DATA: {
        none: cc.Color.WHITE,
        // ant-design-cyan-6-10
        cyan_6: cc.color().fromHEX("#13c2c2"),
        cyan_7: cc.color().fromHEX("#08979c"),
        cyan_8: cc.color().fromHEX("#006d75"),
        cyan_9: cc.color().fromHEX("#00474f"),
        cyan_10: cc.color().fromHEX("#002329"),
        // ant-design-volcano-6-10
        volcano_6: cc.color().fromHEX("#fa541c"),
        volcano_7: cc.color().fromHEX("#d4380d"),
        volcano_8: cc.color().fromHEX("#ad2102"),
        volcano_9: cc.color().fromHEX("#871400"),
        volcano_10: cc.color().fromHEX("#610b00"),
    }
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
            this.node.color = C.DATA[TYPE[this.type_index]]
        }
    }

    @property({ tooltip: "颜色类别", type: cc.Enum(TYPE) })
    private type_index: TYPE = TYPE.none

    @property({ tooltip: "预览" })
    private preview: boolean = false

}