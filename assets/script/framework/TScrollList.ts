import { MLog } from "./MLog";
import { MVersion } from "./MVersion";
import { G } from "./G";

const { ccclass, property, requireComponent, menu } = cc._decorator;
const C = {
    INTERVAL_FRAME: 1,  // 间隔帧
}

/** 列表方向:横向,纵向 */
enum TypeSv { hor, ver }
/** 创建方式:单帧创建,逐帧创建 */
enum TypeCreate { single_frame, next_frame }

/**
 * [T] 常用的滑动列表,针对ScrollView进行简化
 * - [注意] 目前仅支持横向、纵向两种滑动列表
 * - [注意] 仅支持layout方式自动排列,需要手动设置layout的属性
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
@menu("framework/TScrollList")
export class TScrollList extends cc.Component {

    static get(node: cc.Node) { return node.getComponent(TScrollList) }

    onLoad() {
        this.sv = this.node.getComponent(cc.ScrollView)
        this.content = this.sv.content
    }

    private sv: cc.ScrollView;
    private content: cc.Node;
    private data_list: any[] = [];      // 数据列表
    private item_list: cc.Node[] = [];  // item-node列表

    @property(cc.Node)
    private item: cc.Node = null

    @property({ tooltip: "列表方向:横向,纵向", type: cc.Enum(TypeSv) })
    private type_sv: TypeSv = TypeSv.ver

    @property({ tooltip: "创建方式:单帧创建,逐帧创建", type: cc.Enum(TypeCreate) })
    private type_create: TypeCreate = TypeCreate.single_frame

    @property({ tooltip: "是否在check时修改" })
    private check_and_change_flag = true

    @property({ tooltip: "check-all", type: cc.Boolean })
    private get check() { return false }
    private set check(v: boolean) {
        MVersion.is_editor && this.check_all()
    }

    /**
     * 创建item
     * @param data_list 数据列表
     * @param f 初始化函数
     */
    create<T>(data_list: T[], f_init: (node: cc.Node, data: T, index: number) => void) {
        this.data_list = data_list
        this.item_list = []
        this.item.active = false
        switch (this.type_create) {
            case TypeCreate.single_frame:
                data_list.forEach((v, i) => {
                    f_init(this.create_item_node(), v, i)
                })
                break;
            case TypeCreate.next_frame:
                G.run_by_interval_frame((i) => {
                    f_init(this.create_item_node(), data_list[i], i)
                }, this, data_list.length, C.INTERVAL_FRAME)
                break;
            default:
                break;
        }
    }

    /** 创建一个item-node */
    private create_item_node(): cc.Node {
        let node = cc.instantiate(this.item)
        node.parent = this.content
        node.active = true
        this.item_list.push(node)
        return node
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
    }

    /* 检查scroll-view组件的滑动方向是否正确 */
    private check_scroll_view_direction() {
        let f = this.type_sv === TypeSv.hor ? this.sv.horizontal && !this.sv.vertical : !this.sv.horizontal && this.sv.vertical
        if (this.check_and_change_flag) {
            this.sv.horizontal = this.type_sv === TypeSv.hor
            this.sv.vertical = !this.sv.horizontal
        }
        MLog.log("scroll-view-direction", f)
    }

    /* 检查scroll-view节点与mask节点的大小是否统一 */
    private check_scroll_view_size() {
        let f = this.node.width === this.content.parent.width && this.node.height === this.content.parent.height
        if (this.check_and_change_flag) {
            this.content.parent.width = this.node.width
            this.content.parent.height = this.node.height
        }
        MLog.log("scroll-view-size", f)
    }

    /* 检查mask节点的位置是否在原点 */
    private check_mask_position() {
        let f = this.content.parent.position.equals(cc.Vec2.ZERO)
        if (this.check_and_change_flag) {
            this.content.parent.position = cc.Vec2.ZERO
        }
        MLog.log("mask-position", f)
    }

    /* 检查item的anchor中间,position为原点 */
    private check_item_anchor_position() {
        let f = this.item.getAnchorPoint().equals(cc.v2(0.5, 0.5)) && this.item.position.equals(cc.Vec2.ZERO)
        if (this.check_and_change_flag) {
            this.item.setAnchorPoint(cc.v2(0.5, 0.5))
            this.item.position = cc.Vec2.ZERO
        }
        MLog.log("item-anchor", f)
    }

    /* 检查content节点的anchor设置是否正确 */
    private check_content_anchor() {
        let target_anchor = this.type_sv === TypeSv.hor ? cc.v2(0, 0.5) : cc.v2(0.5, 1)
        let f = this.content.getAnchorPoint().equals(target_anchor)
        if (this.check_and_change_flag) {
            this.content.setAnchorPoint(target_anchor)
        }
        MLog.log("content-anchor", f)
    }

    /* 检查content节点的位置是否正确 */
    private check_content_position() {
        let target_position = this.type_sv === TypeSv.hor ? cc.v2(-this.node.width / 2, 0) : cc.v2(0, this.node.height / 2)
        let f = this.content.position.equals(target_position)
        if (this.check_and_change_flag) {
            this.content.position = target_position
        }
        MLog.log("content-position", f)
    }

    /* 如果有layout,检查是否有layout,检查layout的设置是否正确 */
    private check_content_layout() {
        let layout = this.content.getComponent(cc.Layout)
        let f = !!layout
        if (this.check_and_change_flag && !f) {
            layout = this.content.addComponent(cc.Layout)
        }
        MLog.log("content-layout", f)
    }
}
