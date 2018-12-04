const { ccclass, property, executeInEditMode } = cc._decorator
const C = {
    TOOLTIP: {
        NOW_Z_INDEX: '当前的zIndex',
        Z_INDEX: '更改的zIndex',
        PREVIEW: '预览',
    },
}

/**
 * [framework-T] z轴顺序（zIndex）工具
 * - [注意] 仅在编辑器中执行，不在onLoad()时执行
 */
@ccclass
@executeInEditMode
export default class TZIndex extends cc.Component {

    @property({ tooltip: C.TOOLTIP.NOW_Z_INDEX, readonly: true })
    now_z_index = 0

    @property({ tooltip: C.TOOLTIP.Z_INDEX })
    z_index = 0

    @property({ tooltip: C.TOOLTIP.PREVIEW })
    preview = false

    update() {
        if (this.preview) {
            this.preview = false
            this.update_z_index()
        }
    }

    update_z_index() {
        this.node.zIndex = this.z_index
        this.now_z_index = this.node.zIndex
    }
}