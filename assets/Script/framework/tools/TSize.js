const { ccclass, property, executeInEditMode } = cc._decorator
const C = {
    TYPE: cc.Enum({
        /** 以width为基准 */
        WIDTH: 0,
        /** 以height为基准 */
        HEIGHT: 1,
    }),
    TOOLTIP: {
        TYPE: '基准类型',
        PREVIEW: '预览',
        SAVE: '保存',
        SOURCE_SIZE: '初始size',
        CURRENT_SIZE: '当前size',
    },
}
Object.freeze(C)

/**
 * 【框架-工具】size工具，使其保持比例调整大小
 * - 【使用流程】添加脚本-点击save-修改type,修改current_size中的对应项-点击preview
 * - 【注意】计算结果保留1位小数
 * - 【注意】source_size是节点的源比例；尽量save后就不要进行修改
 */
@ccclass
@executeInEditMode
export default class TSize extends cc.Component {

    /** 类型 */
    @property({ tooltip: C.TOOLTIP.TYPE, type: C.TYPE })
    type = C.TYPE.WIDTH

    /** 保存（点击后刷新编辑器） */
    @property({ tooltip: C.TOOLTIP.SAVE })
    save = false

    /** 预览（点击后刷新编辑器） */
    @property({ tooltip: C.TOOLTIP.PREVIEW })
    preview = false

    /** 初始size；x-width；y-height */
    @property({ tooltip: C.TOOLTIP.SOURCE_SIZE, readonly: true })
    source_size = cc.v2(1, 1)

    /** 当前size；x-width；y-height */
    @property({ tooltip: C.TOOLTIP.CURRENT_SIZE, editorOnly: true })
    current_size = cc.v2(1, 1)

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

    /** 更新size；保留1位小数 */
    update_size() {
        switch (this.type) {
            case C.TYPE.WIDTH:
                this.current_size.y = Math.floor(this.current_size.x / (this.source_size.x / this.source_size.y) * 10) / 10
                break;
            case C.TYPE.HEIGHT:
                this.current_size.x = Math.floor(this.current_size.y * (this.source_size.x / this.source_size.y) * 10) / 10
                break;
            default:
                this.current_size.y = Math.floor(this.current_size.x / (this.source_size.x / this.source_size.y) * 10) / 10
                break;
        }
        this.node.width = this.current_size.x
        this.node.height = this.current_size.y
    }

    /** 保存size */
    save_size() {
        this.source_size.x = this.node.width
        this.source_size.y = this.node.height

        this.current_size.x = this.node.width
        this.current_size.y = this.node.height
    }

}