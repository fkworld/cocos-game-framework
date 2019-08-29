import { G } from "./G";

/**
 * [framework] 动画管理
 * - 封装一些简单的常用的动画
 * - 所有的动画函数省略anima前缀
 */
export namespace FAnima {

    /**
     * 时钟动画:每次转动一定的角度
     * @param node
     * @param angle 角度值
     * @param interval 时间间隔,单位s
     */
    export function clock(node: cc.Node, angle: number, interval: number) {
        cc.tween(node)
            .delay(interval)
            .call(() => { node.rotation += angle })
            .repeatForever()
            .start()
    }

    /**
     * 倒计时动画
     * @param label
     * @param n 倒计时时间,实际在倒计时为0后还会停留1s
     * @param last
     */
    export async function countdown(label: cc.Label, n: number, last: string = "Go!") {
        await new Promise(res => {
            cc.tween(label.node)
                .repeat(n + 1, cc.tween().call(() => {
                    label.string = n === 0 ? last : `${n}`
                    n -= 1
                }).delay(1))
                .call(() => { label.string = "" })
                .call(res)
                .start()
        })
    }

    /**
     * 抖动动画,预计持续时间 0.02*15=0.3s
     * @param node
     * @param range 抖动范围,默认为10
     */
    export async function shake(node: cc.Node, range: number = 10) {
        await new Promise(res => {
            let base_position = node.position
            cc.tween(node)
                .repeat(15, cc.tween().call(() => {
                    node.x = base_position.x + G.get_random_float(-range, range)
                    node.y = base_position.y + G.get_random_float(-range, range)
                }).delay(0.02))
                .set({ position: base_position })
                .call(res)
                .start()
        })
    }

}
