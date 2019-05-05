import { MLog } from "./MLog";

const { ccclass, property, menu } = cc._decorator

/**
 * [T] 子节点管理工具
 * - [目的] 用于解决需要在节点内部getChildByName()来获取到子节点的场景
 * - [用法] 需要将此作为需要观察节点的组件；并将需要观察节点的子节点拖入组件；后面的静态方法定义了使用接口
 * - [注意] 理论上可以观察非子节点，但是逻辑上并不推荐使用
 * - [注意] 观察的子节点名称需要不同
 */
@ccclass
@menu("framework/TChildNode")
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

    @property(cc.Node)
    private list_child_node: cc.Node[] = []

    private obj_child_node: { [key: string]: cc.Node } = {}

    /** 数据转化，在第1次调用时使用 */
    private trans_data() {
        for (let i = 0; i < this.list_child_node.length; i += 1) {
            let child_node = this.list_child_node[i]
            if (!child_node) {
                MLog.warn(`@TChildNode: get a null node, node-name=${this.node.name}`)
                continue;
            }
            if (this.obj_child_node[child_node.name]) {
                MLog.warn(`@TChildNode: get a same-name node, node-name=${this.node.name}, same-name=${child_node.name}`)
                continue;
            }
            this.obj_child_node[child_node.name] = child_node
        }
    }


    /**
     * 获取被观察的子节点；如果找不到则返回undefined
     * @param name 
     */
    private get_child_node(name: string): cc.Node {
        if (this.list_child_node.length === 0 || Object.keys(this.obj_child_node).length === 0) {
            this.trans_data()
        }
        if (!this.obj_child_node[name]) {
            MLog.error(`@TChildNode: get a undefined node, name=${name}`)
        }
        return this.obj_child_node[name]
    }
}