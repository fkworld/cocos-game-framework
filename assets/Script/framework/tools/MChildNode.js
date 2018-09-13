const { ccclass, property } = cc._decorator

/**
 * 【框架-工具】子节点管理
 * - 【用途】用于解决需要在节点内部getChildByName()来获取到子节点的场景
 * - 【用法】需要将此作为需要观察节点的组件；并将需要观察节点的子节点拖入组件；后面的静态方法定义了使用接口
 * - 【注意】理论上可以观察非子节点，但是逻辑上并不推荐使用
 * - 【注意】观察的子节点名称需要不同
 */
@ccclass
export default class MChildNode extends cc.Component {

    /** @type {Array<cc.Node>} */
    @property(cc.Node)
    array_node_with_nodename = []

    /** 初始化数据 */
    init_data() {
        // 第1次的时候进行数据初始化
        if (this.object_node === undefined) {
            this.object_node = {}
        } else {
            return
        }
        for (let node of this.array_node_with_nodename) {
            if (node === null) {
                cc.error('[注意] 传入了一个值为null的子节点，请检查挂载的脚本，hang_node_name=', this.node.name)
                continue;
            }
            if (this.object_node[node.name] != undefined) {
                cc.error('[注意] 传入了一个重复名字的子节点，node_name=', node.name)
                continue;
            }
            this.object_node[node.name] = node
        }
    }

    /**
     * 获取被观察的子节点
     * @param {string} name 
     * @returns {undefined | cc.Node}
     */
    get_child_node(name) {
        this.init_data()
        if (this.object_node[name] === undefined) {
            cc.error('[注意] 获取到一个undefined子节点，name=', name)
        }
        return this.object_node[name]
    }

    /**
     * 获取节点中被观察的子节点
     * - 注意：必须是被观察的子节点（需要添加ObserverNode组件并将相应节点拖入）
     * - 非getChildByName()方法
     * - 子节点名字不可重复
     * @param {cc.Node} parent_node 
     * @param {string} child_node_nodename 
     * @returns {undefined | cc.Node}
     * @static
     */
    static get_child_node_by_nodename(parent_node, child_node_nodename) {
        if (parent_node.getComponent(MChildNode) === null) {
            cc.error('[注意] 当前需要观察的子节点未添加MChildNode组件，parent_node_name=', parent_node.name)
        } else {
            return parent_node.getComponent(MChildNode).get_child_node(child_node_nodename)
        }
    }
}