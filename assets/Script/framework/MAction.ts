const { ccclass, property } = cc._decorator;

/**
 * [M] 动画管理
 * - 一些简单的、常用的UI动画
 */
@ccclass
export class MAction extends cc.Component {

    /**
     * 时钟动画：每次转动一定的角度
     * @param node 
     * @param angle 
     * @param interval 
     */
    static clock(node: cc.Node, angle: number, interval: number, count: number) {
        node.runAction(cc.sequence(
            cc.callFunc(() => { node.rotation += angle }),
            cc.delayTime(interval),
        ).repeat(count))
    }
}
