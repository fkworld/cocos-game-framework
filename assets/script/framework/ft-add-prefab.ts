const { ccclass, property, menu } = cc._decorator

/**
 * [T] 动态添加prefab,一般在onLoad()时添加
 */
@ccclass
@menu("framework/FTAddPrefab")
export class FTAddPrefab extends cc.Component {

    static get(node: cc.Node) { return node.getComponent(FTAddPrefab) }

    static get_perfab(node: cc.Node) { return node.getComponent(FTAddPrefab).prefab }

    static get_prefab_node(node: cc.Node) { return node.getComponent(FTAddPrefab).prefab_node }

    @property({ tooltip: "需要添加的prefab", type: cc.Prefab })
    private prefab: cc.Prefab = null

    @property({ tooltip: "是否在onLoad()时自动添加" })
    private is_play_onload: boolean = true

    @property({ tooltip: "是否初始化位置为(0,0)" })
    private is_reset_position: boolean = true

    private prefab_node: cc.Node

    onLoad() {
        this.is_play_onload && this.add_prefab()
    }

    /** 添加prefab */
    add_prefab() {
        this.prefab_node = cc.instantiate(this.prefab)
        this.prefab_node.parent = this.node
        this.prefab_node.position = this.is_reset_position ? cc.Vec2.ZERO : this.prefab_node.position
    }
}