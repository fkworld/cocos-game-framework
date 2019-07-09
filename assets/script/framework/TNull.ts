const { ccclass, menu } = cc._decorator;

/**
 * [T] 空组件
 * - 解决cc.Node不支持的一些cc.Component方法,例如schedule()
 */
@ccclass
@menu("t/TNull")
export class FTNull extends cc.Component {

    static get_or_create(node: cc.Node) { return node.getComponent(FTNull) || node.addComponent(FTNull) }

}
