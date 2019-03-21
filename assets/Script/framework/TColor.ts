import { MVersion } from "./MVersion";

const { ccclass, property, executeInEditMode } = cc._decorator;

/** 颜色分类 */
enum TYPE { none, cyan_1, cyan_2, cyan_3, cyan_4, cyan_5, cyan_6, cyan_7, cyan_8, cyan_9, cyan_10 }
/** 颜色分类对应的颜色数值 */
const COLOR: cc.Color[] = [
    // none
    cc.Color.WHITE,
    // ant-design-cyan-1-10
    cc.color().fromHEX('#e6fffb'),
    cc.color().fromHEX('#b5f5ec'),
    cc.color().fromHEX('#87e8de'),
    cc.color().fromHEX('#5cdbd3'),
    cc.color().fromHEX('#36cfc9'),
    cc.color().fromHEX('#13c2c2'),
    cc.color().fromHEX('#08979c'),
    cc.color().fromHEX('#006d75'),
    cc.color().fromHEX('#00474f'),
    cc.color().fromHEX('#002329'),
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
        if (MVersion.run_editor && this.preview) {
            this.preview = false
            this.node.color = COLOR[this.type]
        }
    }

    @property({ tooltip: '颜色类别', type: cc.Enum(TYPE) })
    private type: TYPE = TYPE.none

    @property({ tooltip: '预览' })
    private preview: boolean = false

}