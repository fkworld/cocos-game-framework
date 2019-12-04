const { ccclass, property, menu } = cc._decorator

/**
 * [T] 调整node-zIndex(节点渲染次序)工具
 * - [注意] 仅在编辑器中执行，不在onLoad时执行
 */
@ccclass
@menu("t/TZIndex")
export class TZIndex extends cc.Component {

    @property({ tooltip: "当前的zIndex", readonly: true })
    private now_z_index = 0

    @property({ tooltip: "更改的zIndex" })
    private z_index = 0

    @property({ tooltip: "编辑器操作" })
    private get E() { return false }
    private set E(v: boolean) { CC_EDITOR && this.update_z_index() }

    private update_z_index() {
        this.node.zIndex = this.z_index
        this.now_z_index = this.node.zIndex
    }

}
