const { ccclass, property, executeInEditMode } = cc._decorator
/** 基准类型 */
enum TYPE { WIDTH, HEIGHT }

/**
 * [framework-T] size工具，使其保持比例调整大小
 * - [使用流程] 添加脚本-点击save-修改type,修改current_size中的对应项-点击preview
 * - [注意] 计算结果保留1位小数
 * - [注意] source_size是节点的源比例；尽量save后就不要进行修改
 */
@ccclass
@executeInEditMode
export default class TSize extends cc.Component {

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
    type: TYPE = TYPE.WIDTH

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

    /**
     * 更新size；保留1位小数
     * @param type 类型
     */
    update_size(type = this.type) {
        switch (type) {
            case TYPE.WIDTH:
                this.current_size.y = Math.floor(this.current_size.x / (this.source_size.x / this.source_size.y) * 10) / 10
                break;
            case TYPE.HEIGHT:
                this.current_size.x = Math.floor(this.current_size.y * (this.source_size.x / this.source_size.y) * 10) / 10
                break;
            default:
                this.current_size.y = Math.floor(this.current_size.x / (this.source_size.x / this.source_size.y) * 10) / 10
                break;
        }
        this.node.width = this.current_size.x
        this.node.height = this.current_size.y
    }
    
}