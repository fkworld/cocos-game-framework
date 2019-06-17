import { G } from "./f-global";

const { ccclass, property } = cc._decorator;
enum TYPE { relative, absolute }
enum TYPE_AXIS { all, x, y }

/**
 * [T] 跟随工具
 * - 使得一个节点跟随另一个节点
 * - cc.follow()方法有bug，已经向creator反馈了issue（https://github.com/cocos-creator/engine/issues/3747）
 * - 使用update更新位置的方式，可能会造成一定程度的性能损耗，慎用
 * @todo 跟随的边缘限制
 */
@ccclass
export class FTFollow extends cc.Component {

    static get(node: cc.Node) { return node.getComponent(FTFollow) }

    @property({ tooltip: '目标节点', type: cc.Node })
    target: cc.Node = null

    @property({ tooltip: '跟随类型；relative表示维持相对位置不变，absolute表示直接跟随', type: cc.Enum(TYPE) })
    type: TYPE = TYPE.relative

    @property({ tooltip: '跟随类型；x表示在x轴上跟随，y表示在y轴上跟随，all表示在x/y轴上均跟随', type: cc.Enum(TYPE_AXIS) })
    type_axis: TYPE_AXIS = TYPE_AXIS.all

    @property({ tooltip: '是否直接跟随' })
    is_following: boolean = false

    /** relative模式下的偏移量 */
    offset: cc.Vec2 = null

    start() {
        this.get_offset()
    }

    update() {
        if (!this.is_following || !this.target) { return }
        let target_position: cc.Vec2 = this.node.getParent().convertToNodeSpaceAR(G.get_node_world_position(this.target))
        switch (this.type) {
            case TYPE.relative: target_position = target_position.add(this.offset); break;
            default: case TYPE.absolute: target_position = target_position; break;
        }
        switch (this.type_axis) {
            case TYPE_AXIS.x: this.node.x = target_position.x; break;
            case TYPE_AXIS.y: this.node.y = target_position.y; break;
            default: case TYPE_AXIS.all: this.node.position = target_position; break;
        }
    }

    /** 计算target */
    get_offset() {
        if (!this.target) { return }
        this.offset = G.get_node_world_position(this.node).sub(G.get_node_world_position(this.target))
    }

    /** 更改目标 */
    change_target(new_target: cc.Node) {
        this.pause_follow()
        this.target = new_target
        this.get_offset()
        this.follow()
    }

    follow() { this.is_following = true }

    pause_follow() { this.is_following = false }

    stop_follow() { this.is_following = false; this.target = null }
}