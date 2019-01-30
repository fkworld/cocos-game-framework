const { ccclass, property, executeInEditMode } = cc._decorator;

/** 颜色分类 */
enum TYPE { none }
/** 颜色分类对应的颜色数值 */
const COLOR: cc.Color[] = [
    cc.Color.WHITE,
]


/**
 * [T] 颜色工具
 * - [注意] 不在onLoad()时执行，需要手动在编辑器中preview
 * - [参考资料] Ant-design推荐的颜色设计：https://ant.design/docs/spec/colors-cn
 */
@ccclass
@executeInEditMode
export class TColor extends cc.Component {

    update() {
        if (this.preview) {
            this.preview = false
            this.node.color = COLOR[this.type]
        }
    }

    @property({ tooltip: '颜色类别', type: cc.Enum(TYPE) })
    type: TYPE = TYPE.none

    @property({ tooltip: '预览' })
    preview: boolean = false


}