import { FMLog } from "./fm-log";

const { ccclass, property, menu } = cc._decorator

/**
 * [T] 子节点管理工具
 * - [目的] 用于解决需要在节点内部getChildByName()来获取到子节点的场景
 * - [用法] 需要将此作为需要观察节点的组件,并将需要观察节点的子节点拖入组件,后面的静态方法定义了使用接口
 * - [注意] 理论上可以观察非子节点，但是逻辑上并不推荐使用
 * - [注意] 观察的子节点名称需要不同
 */
@ccclass
@menu("framework/FTChild")
export class FTChild extends cc.Component {

    /**
     * 获取节点中被观察的子节点
     * @param parent_node 
     * @param child_node_nodename 
     * @static
     */
    static get_child_node(parent_node: cc.Node, child_node_nodename: string) {
        return parent_node.getComponent(FTChild).get_child_node(child_node_nodename)
    }

    @property(cc.Node)
    private list_child_node: cc.Node[] = []

    private map_child_node: Map<string, cc.Node> = new Map()

    /**
     * 获取被观察的子节点,如果找不到则返回undefined
     * @param name 
     */
    private get_child_node(name: string): cc.Node {
        // 第一次查询时写入map
        if (this.list_child_node.length != 0 && this.map_child_node.size === 0) {
            this.list_child_node.forEach(v => {
                if (!v) {
                    FMLog.warn(`@FTChild: get a null node, node-name=${this.node.name}`)
                    return
                }
                if (this.map_child_node.get(v.name)) {
                    FMLog.warn(`@FTChild: get a same-name node, node-name=${this.node.name}, same-name=${v.name}`)
                    return;
                }
                this.map_child_node.set(v.name, v)
            })
        }
        let n = this.map_child_node.get(name)
        if (!n) {
            FMLog.error(`@FTChild: get a undefined node, name=${name}`)
        }
        return n
    }
}