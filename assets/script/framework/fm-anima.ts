/**
 * [M] 动画管理
 * - 封装一些简单的常用的动画
 */
export class FMAnima {

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

    /**
     * 倒计时动画
     * @param label 
     * @param n 
     */
    static count_down(label: cc.Label, n: number) {
        return new Promise(res => {
            label.string = `${n}`
            label.node.scale = 0
            label.node.active = true
            label.node.runAction(cc.sequence(
                cc.delayTime(0.6),
                cc.scaleTo(0.2, 0).easing(cc.easeBackIn()),
                cc.callFunc(() => {
                    n -= 1
                    label.string = `${n}`
                    if (n < 0) {
                        label.node.stopAllActions()
                        res()
                    }
                }),
                cc.scaleTo(0.2, 1).easing(cc.easeBounceOut()),
            ).repeatForever())
        })
    }
}
