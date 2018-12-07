const { ccclass } = cc._decorator;

/**
 * [framework-T] 空组件
 * - 解决cc.Node不支持的一些cc.Component方法，例如schedule()
 */
@ccclass
export class TNull extends cc.Component {

    static get(node: cc.Node) {
        if (node.getComponent(TNull)) { return node.getComponent(TNull) }
        return node.addComponent(TNull)
    }

}
