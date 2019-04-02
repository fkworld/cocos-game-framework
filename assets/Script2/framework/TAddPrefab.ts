const { ccclass, property } = cc._decorator

/**
 * [T] 动态添加prefab，一般在onLoad()时添加
 */
@ccclass
export class TAddPrefab extends cc.Component {

    static get(node: cc.Node) { return node.getComponent(TAddPrefab) }

    static get_perfab(node: cc.Node) { return node.getComponent(TAddPrefab).prefab }

    static get_prefab_node(node: cc.Node) { return node.getComponent(TAddPrefab).prefab_node }

    @property({ tooltip: '需要添加的prefab', type: cc.Prefab })
    private prefab: cc.Prefab = null

    /** 是否在onLoad()时自动创建 */
    @property({ tooltip: '是否在onLoad()时自动添加' })
    private is_play_onload: boolean = true

    /** 创建时是否重置位置为0 */
    @property({ tooltip: '是否初始化位置为(0,0)' })
    private is_reset_position: boolean = true

    /** prefab创建成功后对应的node */
    private prefab_node: cc.Node

    onLoad() {
        if (this.is_play_onload) {
            this.add_prefab()
        }
    }

    /** 添加prefab */
    add_prefab() {
        this.prefab_node = cc.instantiate(this.prefab)
        this.prefab_node.parent = this.node
        this.prefab_node.position = this.is_reset_position ? cc.Vec2.ZERO : this.prefab_node.position
    }
}