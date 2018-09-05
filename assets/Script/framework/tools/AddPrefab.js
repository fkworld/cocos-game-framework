const { ccclass, property } = cc._decorator

const C = {
    TOOLIP: {
        PREFAB: '需要添加的prefab',
        PLAY_ONLOAD: '是否在onLoad()时自动添加',
    }
}
Object.freeze(C)

/**
 * 游戏框架：游戏开始时添加prefab
 */
@ccclass
export default class AddPrefab extends cc.Component {

    /** @type {cc.Prefab} 需要添加的prefab */
    @property({ tooltip: C.TOOLIP.PREFAB, type: cc.Prefab })
    prefab = null

    /** @type {boolean} 是否自动添加 */
    @property({ tooltip: C.TOOLIP.PLAY_ONLOAD })
    play_onload = true

    onLoad() {
        if (this.play_onload) {
            this.add_prefab()
        }
    }

    /** 添加prefab为子节点 */
    add_prefab() {
        this.prefab_node = cc.instantiate(this.prefab)
        this.prefab_node.parent = this.node
        this.prefab_node.position = cc.Vec2.ZERO
    }

    /**
     * 获取当前node下被AddPrefab脚本添加的prefab节点
     * @param {cc.Node} node 
     */
    static get_prefab_node(node) {
        try {
            return node.getComponent(AddPrefab).prefab_node
        } catch (error) {
            cc.error('[错误] 没有获取到AddPrefab脚本添加的prefab节点，error=', error)
            return undefined
        }
    }
}