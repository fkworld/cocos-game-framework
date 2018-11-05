const { ccclass, property } = cc._decorator

const C = {
    TOOLIP: {
        PREFAB: '需要添加的prefab',
        PLAY_ONLOAD: '是否在onLoad()时自动添加',
        RESET_POSITION: '是否初始化位置为(0,0)',
    }
}
Object.freeze(C)

/**
 * 【框架-工具】游戏开始时添加prefab
 * - prefab会初始化位置为0
 */
@ccclass
export default class TAddPrefab extends cc.Component {

    /**
     * 获取当前node下被AddPrefab脚本添加的prefab节点
     * - 此方法仅仅适用于脚本上只有一个TAddPrefab组件的情况
     * @param {cc.Node} node 
     */
    static get_prefab_node(node) {
        return node.getComponent(AddPrefab).prefab_node
    }

    /** @type {cc.Prefab} 需要添加的prefab */
    @property({ tooltip: C.TOOLIP.PREFAB, type: cc.Prefab })
    prefab = null

    /** @type {boolean} 是否在onLoad时自动添加 */
    @property({ tooltip: C.TOOLIP.PLAY_ONLOAD })
    is_play_onload = true

    /** @type {boolean} 是否重置位置为0 */
    @property({ tooltip: C.TOOLIP.RESET_POSITION })
    is_reset_position = true

    onLoad() {
        if (this.is_play_onload) {
            this.add_prefab()
        }
    }

    /** 添加prefab为子节点 */
    add_prefab() {
        this.prefab_node = cc.instantiate(this.prefab)
        this.prefab_node.parent = this.node
        if (this.is_reset_position) {
            this.prefab_node.position = cc.Vec2.ZERO
        }
    }
}