import { MLog } from "./MLog";

/**
 * [M] 动画管理
 * - 封装一些简单的常用的动画
 */
export class MAction {

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
     * @param node 
     * @param number 
     * @param f 
     */
    static count_down(node: cc.Node, number: number, f = () => { }) {
        let label = node.getComponent(cc.Label)
        if (!label) { MLog.warn(`@MAction: no label component`); return }
        label.unscheduleAllCallbacks()
        label.string = `${number}`
        node.active = true
        label.schedule(() => {
            number -= 1
            label.string = `${number}`
            if (number <= 0) {
                node.active = false
                f()
            }
        }, 1, number)
    }
}
