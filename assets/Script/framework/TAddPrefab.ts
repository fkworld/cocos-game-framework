const { ccclass, property } = cc._decorator

/**
 * [T] 游戏开始时添加prefab
 */
@ccclass
export class TAddPrefab extends cc.Component {

    static get(node: cc.Node) { return node.getComponent(TAddPrefab) }

    /**
     * 获取当前脚本创建的node
     * @param node 
     */
    static get_prefab_node(node: cc.Node) {
        return node.getComponent(TAddPrefab).prefab_node
    }

    @property({ tooltip: '需要添加的prefab', type: cc.Prefab })
    prefab: cc.Prefab = null

    /** 是否在onLoad()时自动创建 */
    @property({ tooltip: '是否在onLoad()时自动添加；默认自动添加' })
    is_play_onload: boolean = true

    /** 创建时是否重置位置为0 */
    @property({ tooltip: '是否初始化位置为(0,0)' })
    is_reset_position: boolean = true

    /** prefab创建成功后对应的node */
    prefab_node: cc.Node

    onLoad() {
        if (this.is_play_onload) { this.prefab_node = this.add_prefab() }
    }

    /**
     * 添加prefab到游戏场景中
     * @param prefab 
     * @param parent_node 
     * @param is_reset_position
     */
    add_prefab() {
        let n = cc.instantiate(this.prefab)
        n.setParent(this.node)
        n.position = this.is_reset_position ? cc.Vec2.ZERO : n.position
        return n
    }
}