import { FVersion } from "./FVersion";
import { G } from "./G";

const { ccclass, property, menu } = cc._decorator

/**
 * [T] 调整node-size工具,使其保持比例
 * - [用法] 点击save,修改大小(width/height),点击根据width还是height修改
 * - [注意] 计算结果保留1位小数
 * - [注意] source_size是节点的源比例;尽量save后就不要进行修改
 */
@ccclass
@menu("t/TSize")
export class TSize extends cc.Component {

    @property({ tooltip: "源size", readonly: true })
    private source_size: cc.Vec2 = cc.v2(1, 1)

    @property({ tooltip: "调整之后的size" })
    private current_size: cc.Vec2 = cc.v2(1, 1)

    @property({ tooltip: "编辑器操作-将当前size保存为源size" })
    private get E_save() { return false }
    private set E_save(v: boolean) {
        FVersion.is_editor() && this.save_size()
    }

    @property({ tooltip: "编辑器操作-根据width修改" })
    private get E_change_by_width() { return false }
    private set E_change_by_width(v: boolean) {
        FVersion.is_editor() && this.change_size_by_width()
    }

    @property({ tooltip: "编辑器操作-更具height修改" })
    private get E_change_by_height() { return false }
    private set E_change_by_height(v: boolean) {
        FVersion.is_editor() && this.change_size_by_height()
    }

    /** 保存size */
    private save_size() {
        this.source_size.x = this.node.width
        this.source_size.y = this.node.height
        this.current_size.x = this.node.width
        this.current_size.y = this.node.height
    }

    /** 根据width修改size */
    private change_size_by_width() {
        this.current_size.y = G.get_number_fixed(this.current_size.x / this.source_size.x * this.source_size.y)
        this.node.width = this.current_size.x
        this.node.height = this.current_size.y
    }

    /** 根据height修改size */
    private change_size_by_height() {
        this.current_size.x = G.get_number_fixed(this.current_size.y * this.source_size.x / this.source_size.y)
        this.node.width = this.current_size.x
        this.node.height = this.current_size.y
    }

}
