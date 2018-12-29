import { G } from "./G";

const { ccclass, property, executeInEditMode } = cc._decorator
/** 基准类型 */
enum TYPE { width, height }

/**
 * [T] size工具，使其保持比例调整大小
 * - [使用流程] 添加脚本-点击save-修改type,修改current_size中的对应项-点击preview
 * - [注意] 计算结果保留1位小数
 * - [注意] source_size是节点的源比例；尽量save后就不要进行修改
 */
@ccclass
@executeInEditMode
export class TSize extends cc.Component {

    update() {
        if (this.preview) {
            this.preview = false
            this.update_size()
        }
        if (this.save) {
            this.save = false
            this.save_size()
        }
    }

    /** 类型 */
    @property({ tooltip: '基准类型', type: cc.Enum(TYPE) })
    type: TYPE = TYPE.width

    /** 保存（点击后刷新编辑器） */
    @property({ tooltip: '保存' })
    save: boolean = false

    /** 初始size；x-width；y-height */
    @property({ tooltip: '基准size', readonly: true })
    source_size: cc.Vec2 = cc.v2(1, 1)

    /** 预览（点击后刷新编辑器） */
    @property({ tooltip: '预览' })
    preview: boolean = false

    /** 当前size；x-width；y-height */
    @property({ tooltip: '当前size' })
    current_size: cc.Vec2 = cc.v2(1, 1)

    /**
     * 保存size
     */
    save_size() {
        this.source_size.x = this.node.width
        this.source_size.y = this.node.height

        this.current_size.x = this.node.width
        this.current_size.y = this.node.height
    }

    /** 更新size，保留1位小数 */
    update_size() {
        switch (this.type) {
            case TYPE.width:
                this.current_size.y = G.number_fixed(this.current_size.x / this.source_size.x * this.source_size.y)
                break;
            case TYPE.height:
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