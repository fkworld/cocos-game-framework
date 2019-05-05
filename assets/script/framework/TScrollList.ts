import { MLog } from "./MLog";
import { MVersion } from "./MVersion";

const { ccclass, property, requireComponent, executeInEditMode, menu } = cc._decorator;
const C = {

}
enum TYPE_SV { hor, ver }                   // 列表方向：横向,纵向
enum TYPE_CONTENT { layout, position }      // 列表中item的组合方式：layout自动拼装,无layout修改位置

/**
 * [T] 常用的滑动列表,针对ScrollView进行简化
 * - [注意] 目前仅支持横向、纵向两种滑动列表
 * - [注意] 目前支持layout自动排序和手动position排序
 * - [使用方式]
 *  1. 新建一个ScrollView节点,仅有mask节点(view),content节点,item节点有效,其余可以自由删减
 *  2. 将TScrollList脚本挂载在ScrollView组件所在的节点上,将item节点拖入,设置好方向和位置排序方式
 *  3. 将TScrollList的check_and_change置true,自动修改；如果要手动修改,可以使用check_only
 *  4. 在需要的地方,使用TScrollList的实例方法create()进行创建,传入数据列表
 * - [注意] 并没有分批次创建,而是一次创建完毕,所以如果列表项目较多可能有性能压力
 * @todo 分批次创建
 * @todo 更多的针对item的操作,比如滑动到某个列表项,搜索某个列表项等
 */
@ccclass
@requireComponent(cc.ScrollView)
@executeInEditMode
@menu("framework/TScrollList")
export class TScrollList extends cc.Component {

    static get(node: cc.Node) { return node.getComponent(TScrollList) }

    onLoad() {
        this.sv = this.node.getComponent(cc.ScrollView)
        this.content = this.sv.content
    }

    update() {
        if (MVersion.run_editor && this.check) {
            this.check = false
            this.check_all()
        }
    }

    private sv: cc.ScrollView = null
    private content: cc.Node = null
    item_list: cc.Node[] = []

    @property(cc.Node)
    private item: cc.Node = null

    @property({ type: cc.Enum(TYPE_SV) })
    private type_sv: TYPE_SV = TYPE_SV.ver

    @property({ type: cc.Enum(TYPE_CONTENT) })
    private type_content: TYPE_CONTENT = TYPE_CONTENT.layout

    @property({ tooltip: '' })
    private check_and_change_flag = true

    @property()
    private check = false

    /**
     * 创建item
     * @param data_list 数据列表
     * @param f 初始化函数
     */
    create(data_list: any[], f: (node: cc.Node, index: number, data: any) => void) {
        this.item_list = []
        // 将源item置为false
        this.item.active = false
        for (let index = 0; index < data_list.length; index += 1) {
            // 创建新的item
            let node = cc.instantiate(this.item)
            node.parent = this.content
            node.position = cc.Vec2.ZERO
            // 保存item
            this.item_list.push(node)
            // 给新的item执行初始化函数
            f(node, index, data_list[index])
            node.active = true
            // 更新每个item的位置信息
            if (this.type_content === TYPE_CONTENT.layout) {
                // 如果为layout模式,则由layout自动排序,无需修改位置信息
            } else {
                if (this.type_sv === TYPE_SV.hor) {
                    node.position = cc.v2(node.width / 2 + node.width * index, 0)
                } else {
                    node.position = cc.v2(0, -node.height / 2 - node.height * index)
                }
            }
        }
        // 更新整个cotent的大小
        if (this.type_content === TYPE_CONTENT.layout) {
            // 如果为layout模式,则由layout自动扩容,无需修改大小
        } else {
            if (this.type_sv === TYPE_SV.hor) {
                this.content.width = this.item.width * data_list.length
            } else {
                this.content.height = this.item.height * data_list.length
            }
        }
    }

    /** 检查所有设置是否正确 */
    private check_all() {
        MLog.log(`@${this.node.name}: check-scroll-view-setting`)
        this.check_scroll_view_direction()
        this.check_scroll_view_size()
        this.check_mask_position()
        this.check_item_anchor_position()
        this.check_content_anchor()
        this.check_content_position()
        this.check_content_layout()
        this.content.width = 0
        this.content.height = 0
    }

    /* 检查scroll-view组件的滑动方向是否正确 */
    private check_scroll_view_direction() {
        let f = this.type_sv === TYPE_SV.hor ? this.sv.horizontal && !this.sv.vertical : !this.sv.horizontal && this.sv.vertical
        if (this.check_and_change_flag) {
            this.sv.horizontal = this.type_sv === TYPE_SV.hor
            this.sv.vertical = !this.sv.horizontal
        }
        MLog.log('scroll-view-direction', f)
    }

    /* 检查scroll-view节点与mask节点的大小是否统一 */
    private check_scroll_view_size() {
        let f = this.node.width === this.content.parent.width && this.node.height === this.content.parent.height
        if (this.check_and_change_flag) {
            this.content.parent.width = this.node.width
            this.content.parent.height = this.node.height
        }
        MLog.log('scroll-view-size', f)
    }

    /* 检查mask节点的位置是否在原点 */
    private check_mask_position() {
        let f = this.content.parent.position.equals(cc.Vec2.ZERO)
        if (this.check_and_change_flag) {
            this.content.parent.position = cc.Vec2.ZERO
        }
        MLog.log('mask-position', f)
    }

    /* 检查item的anchor中间,position为原点 */
    private check_item_anchor_position() {
        let f = this.item.getAnchorPoint().equals(cc.v2(0.5, 0.5)) && this.item.position.equals(cc.Vec2.ZERO)
        if (this.check_and_change_flag) {
            this.item.setAnchorPoint(cc.v2(0.5, 0.5))
            this.item.position = cc.Vec2.ZERO
        }
        MLog.log('item-anchor', f)
    }

    /* 检查content节点的anchor设置是否正确 */
    private check_content_anchor() {
        let target_anchor = this.type_sv === TYPE_SV.hor ? cc.v2(0, 0.5) : cc.v2(0.5, 1)
        let f = this.content.getAnchorPoint().equals(target_anchor)
        if (this.check_and_change_flag) {
            this.content.setAnchorPoint(target_anchor)
        }
        MLog.log('content-anchor', f)
    }

    /* 检查content节点的位置是否正确 */
    private check_content_position() {
        let target_position = this.type_sv === TYPE_SV.hor ? cc.v2(-this.node.width / 2, 0) : cc.v2(0, this.node.height / 2)
        let f = this.content.position.equals(target_position)
        if (this.check_and_change_flag) {
            this.content.position = target_position
        }
        MLog.log('content-position', f)
    }

    /* 如果有layout,检查layout的设置是否正确 */
    private check_content_layout() {
        if (this.type_content != TYPE_CONTENT.layout) { return }
        let f = false
        let layout = this.content.getComponent(cc.Layout)
        if (layout) {
            f = this.type_sv === TYPE_SV.hor ? layout.type === cc.Layout.Type.HORIZONTAL : layout.type === cc.Layout.Type.VERTICAL
            f = f && layout.resizeMode === cc.Layout.ResizeMode.CONTAINER
        } else {
            f = false
        }
        if (this.check_and_change_flag) {
            if (!layout) { layout = this.content.addComponent(cc.Layout) }
            layout.type = this.type_sv === TYPE_SV.hor ? cc.Layout.Type.HORIZONTAL : cc.Layout.Type.VERTICAL
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
        }
        MLog.log('content-layout', f)
    }
}
