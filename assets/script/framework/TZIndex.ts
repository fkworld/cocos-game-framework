import { MVersion } from "./MVersion";

const { ccclass, property, menu } = cc._decorator

/**
 * [framework-T] z轴顺序(zIndex)工具
 * - [注意] 仅在编辑器中执行，不在onLoad()时执行
 */
@ccclass
@menu("framework/TZIndex")
export class TZIndex extends cc.Component {

    @property({ tooltip: '当前的zIndex', readonly: true })
    private now_z_index = 0

    @property({ tooltip: '更改的zIndex' })
    private z_index = 0

    @property({ tooltip: "预览", type: cc.Boolean })
    private get preview() { return false }
    private set preview(v: boolean) {
        MVersion.run_editor && this.update_z_index()
    }

    private update_z_index() {
        this.node.zIndex = this.z_index
        this.now_z_index = this.node.zIndex
    }

}