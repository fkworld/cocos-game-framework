const { ccclass, property } = cc._decorator

/**
 * [T] 子节点管理工具
 * - [目的] 用于解决需要在节点内部getChildByName()来获取到子节点的场景
 * - [用法] 需要将此作为需要观察节点的组件；并将需要观察节点的子节点拖入组件；后面的静态方法定义了使用接口
 * - [注意] 理论上可以观察非子节点，但是逻辑上并不推荐使用
 * - [注意] 观察的子节点名称需要不同
 */
@ccclass
export class TChildNode extends cc.Component {

    /**
     * 获取节点中被观察的子节点
     * @param parent_node 
     * @param child_node_nodename 
     * @static
     */
    static get_child_node(parent_node: cc.Node, child_node_nodename: string) {
        return parent_node.getComponent(TChildNode).get_child_node(child_node_nodename)
    }

    onLoad() {
        this.trans_array_to_object()
    }

    /** 子节点列表 */
    @property(cc.Node)
    array_child_node: cc.Node[] = []

    /** 子节点存储表；name-node */
    obj_child_node: { string: cc.Node } | {} = {}

    /** 重构数据；将[]转化为{} */
    trans_array_to_object() {
        for (let node of this.array_child_node) {
            if (node === null) {
                cc.error(`[TChildNode] get a null node, check node ${this.node.name}`)
                continue;
            }
            if (this.obj_child_node[node.name] != undefined) {
                cc.error(`[TChildNode] get a same-name node, check node ${this.node.name}, same-name=${node.name}`)
                continue;
            }
            this.obj_child_node[node.name] = node
        }
    }

    /**
     * 获取被观察的子节点；如果找不到则返回undefined
     * @param name 
     */
    get_child_node(name: string): cc.Node {
        if (this.obj_child_node[name] === undefined) {
            cc.error(`[TChildNode] get a undefined node, name=${name}`)
        }
        return this.obj_child_node[name]
    }
}