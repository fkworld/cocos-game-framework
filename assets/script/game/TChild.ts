const { ccclass, property } = cc._decorator;

/**
 * 子节点管理工具
 * - 使用场景：少量的子节点需要被使用到。
 * - 以节点名称作为区分。
 */
@ccclass
export class TChild extends cc.Component {

    /**
     * 获取子节点
     * @param parent_node 父节点
     * @param child_nodename 子节点名称
     */
    static get_child(parent_node: cc.Node, child_nodename: string): cc.Node {
        let r = parent_node.getComponent(TChild).child_list.find(v => v.name === child_nodename)
        if(!r) cc.error(`@TChild: node不存在, name=${name}`)
        return r
    }

    @property({ tooltip: "子节点列表", type: cc.Node })
    private child_list: cc.Node[] = []
}
