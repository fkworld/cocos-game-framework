import { FLog } from "./FLog";

const { ccclass, property, menu } = cc._decorator

/**
 * [T] 子节点管理工具
 * - [目的] 用于解决需要在节点内部getChildByName()来获取到子节点的场景
 * - [用法] 需要将此作为需要观察节点的组件,并将需要观察节点的子节点拖入组件,后面的静态方法定义了使用接口
 * - [注意] 理论上可以观察非子节点，但是逻辑上并不推荐使用
 * - [注意] 观察的子节点名称需要不同
 */
@ccclass
@menu("t/TChild")
export class TChild extends cc.Component {

    /**
     * 获取节点中被观察的子节点
     * @param parent_node
     * @param child_node_nodename
     */
    static get_child(parent_node: cc.Node, child_nodename: string): cc.Node {
        return parent_node.getComponent(TChild).get_child(child_nodename)
    }

    @property({ tooltip: "子节点列表", type: cc.Node })
    private list_child: cc.Node[] = []

    private map_child: Map<string, cc.Node> = new Map()

    /** 将list保存为map */
    private set_all_child() {
        this.list_child.forEach(v => {
            if (!v) {
                FLog.warn(`@TChild: node的值为null, name=${v.name}`)
                return
            }
            if (this.map_child.has(v.name)) {
                FLog.warn(`@TChild: node-name重复, name=${v.name}`)
                return
            }
            this.map_child.set(v.name, v)
        })
    }

    /**
     * 获取被观察的子节点
     * @param name
     */
    private get_child(name: string): cc.Node {
        // 第一次查询时写入map
        if (this.map_child.size === 0) {
            this.set_all_child()
        }
        // 查询
        let n = this.map_child.get(name)
        if (!n) {
            FLog.error(`@TChild: node不存在, name=${name}`)
        }
        return n
    }
}
