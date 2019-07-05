import { FMVersion } from "./fm-version";

const { ccclass, property, menu } = cc._decorator

/**
 * [framework-T] z轴顺序(zIndex)工具
 * - [注意] 仅在编辑器中执行，不在onLoad()时执行
 */
@ccclass
@menu("framework/FTZIndex")
export class FTZIndex extends cc.Component {

    @property({ tooltip: '当前的zIndex', readonly: true })
    private now_z_index = 0

    @property({ tooltip: '更改的zIndex' })
    private z_index = 0

    @property({ tooltip: "编辑器操作" })
    private get do_editor() { return false }
    private set do_editor(v: boolean) {
        FMVersion.is_editor() && this.update_z_index()
    }

    private update_z_index() {
        this.node.zIndex = this.z_index
        this.now_z_index = this.node.zIndex
    }

}