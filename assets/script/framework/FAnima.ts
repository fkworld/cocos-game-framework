import { G } from "./G";

/**
 * [M] 动画管理
 * - 封装一些简单的常用的动画
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
     * 使用依次显示string的方式来标识倒计时
     * @param label
     * @param str_list
     */
    export async function count_down_with_string_list(label: cc.Label, str_list: string[]): Promise<void> {
        await new Promise(res => {
            cc.tween(label.node)
                .sequence(
                    cc.tween().call(() => { label.string = str_list.shift() }),
                    cc.tween().delay(1)
                )
                .repeat(str_list.length)
                .call(() => { label.string = "" })
                .call(res)
                .start()
        })

    }

    /**
     * 抖动,预计持续时间 0.02*15=0.3s
     * @param node
     * @param range 抖动范围,默认为10
     */
    export async function shake(node: cc.Node, range: number = 10) {
        let base_position = node.position
        await new Promise(res => {
            cc.tween(node)
                .sequence(
                    cc.tween().call(() => {
                        let x = G.get_random_float(-range, range)
                        let y = G.get_random_float(-range, range)
                        node.position = base_position.add(cc.v2(x, y))
                    }),
                    cc.tween().delay(0.02)
                )
                .repeat(15)
                .set({ position: base_position })
                .call(res)
                .start()

        })
    }

}
