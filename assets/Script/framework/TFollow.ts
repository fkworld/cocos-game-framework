import { G } from "./G";

const { ccclass, property } = cc._decorator;

enum TYPE { relative, absolute }

/**
 * [T] 跟随工具
 */
@ccclass
export class TFollow extends cc.Component {

    static get(node: cc.Node) { return node.getComponent(TFollow) }

    @property({ tooltip: '目标节点', type: cc.Node })
    target: cc.Node = null

    @property({ tooltip: '跟随类型；relative表示维持相对位置不变，absolute表示直接跟随', type: cc.Enum(TYPE) })
    type: TYPE = TYPE.relative

    @property({ tooltip: '是否直接跟随' })
    is_following = false

    /** relative模式下的偏移量 */
    offset: cc.Vec2 = null

    update() {
        if (!this.is_following || !this.target) { return }
        switch (this.type) {
            case TYPE.relative:
                if (this.offset === null) { this.offset = G.get_node_world_position(this.node).sub(G.get_node_world_position(this.target)) }
                this.node.position = this.node.getParent().convertToNodeSpaceAR(G.get_node_world_position(this.target).add(this.offset))
                break;
            case TYPE.absolute:
                this.node.position = this.node.getParent().convertToNodeSpaceAR(G.get_node_world_position(this.target))
                break;
            default:
                break;
        }
    }

    change_target(new_target: cc.Node) {
        this.pause_follow()
        this.target = new_target
        this.offset = G.get_node_world_position(this.node).sub(G.get_node_world_position(this.target))
        this.follow()
    }

    follow() { this.is_following = true }

    pause_follow() { this.is_following = false }

    stop_follow() { this.is_following = false; this.target = null }
}