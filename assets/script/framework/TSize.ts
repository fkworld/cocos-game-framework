import { G } from "./G";
import { MVersion } from "./MVersion";

const { ccclass, property, executeInEditMode, menu } = cc._decorator

/** 基准类型枚举 */
enum TypeBase { width, height }

/**
 * [T] size工具，使其保持比例调整大小
 * - [使用流程] 添加脚本,点击save,修改type,修改current_size中的对应项,点击preview
 * - [注意] 计算结果保留1位小数
 * - [注意] source_size是节点的源比例;尽量save后就不要进行修改
 */
@ccclass
@executeInEditMode
@menu("framework/TSize")
export class TSize extends cc.Component {

    update() {
        if (MVersion.run_editor && this.preview) {
            this.preview = false
            this.update_size()
        }
        if (MVersion.run_editor && this.save) {
            this.save = false
            this.save_size()
        }
    }

    @property({ tooltip: "基准类型", type: cc.Enum(TypeBase) })
    private type: TypeBase = TypeBase.width

    @property({ tooltip: "基准size", readonly: true })
    private source_size: cc.Vec2 = cc.v2(1, 1)

    @property({ tooltip: "当前size" })
    private current_size: cc.Vec2 = cc.v2(1, 1)

    @property({ tooltip: "保存" })
    private save: boolean = false

    @property({ tooltip: "预览" })
    private preview: boolean = false

    /** 保存size */
    private save_size() {
        this.source_size.x = this.node.width
        this.source_size.y = this.node.height

        this.current_size.x = this.node.width
        this.current_size.y = this.node.height
    }

    /** 更新size，保留1位小数 */
    private update_size() {
        switch (this.type) {
            case TypeBase.width:
                this.current_size.y = G.number_fixed(this.current_size.x / this.source_size.x * this.source_size.y)
                break;
            case TypeBase.height:
                this.current_size.x = G.number_fixed(this.current_size.y * this.source_size.x / this.source_size.y)
                break;
            default:
                this.current_size.y = G.number_fixed(this.current_size.x / this.source_size.x * this.source_size.y)
                break;
        }
        this.node.width = this.current_size.x
        this.node.height = this.current_size.y
    }

}