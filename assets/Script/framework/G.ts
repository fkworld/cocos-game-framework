/**
 * [framework] 全局方法类
 * - 封装一些重要的/常用的方法
 */
export class G {

    /**
     * 获取一个随机整数
     * - [min,max)
     * @param min 
     * @param max 
     * @static
     */
    static random_int(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min)
    }

    /**
     * 获取一个随机小数
     * - [min,max)
     * @param min 
     * @param max 
     * @static
     */
    static random_float(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    /**
     * 从数组中获取一个量
     * - 概率相等
     * - 当数组长度为0时，会输出log并返回一个undefined
     * @param array 
     * @static
     */
    static random_array_item(array: any[]) {
        if (array.length === 0) { cc.warn('[G] 获取了一个长度为0的数组') }
        return array[G.random_int(0, array.length)]
    }

    /**
     * 将一个多次执行的方法放到多帧中执行，避免单帧中消耗过多性能造成卡顿
     * - 使用cc.Component.schedule()方法，在interval参数为0时表示逐帧调用
     * @param f 需要执行的方法
     * @param nc 执行方法的节点脚本
     * @param all_count 执行的总数
     * @static
     */
    static run_by_each_frame(f: Function, nc: cc.Component, all_count: number) {
        nc.schedule(f, 0, all_count - 1)
    }

    /**
     * 间隔帧执行
     * @param f 
     * @param nc 
     * @param all_count 
     * @param interval 间隔帧；默认为1，表示连续帧
     * @static
     */
    static run_by_interval_frame(f: Function, nc: cc.Component, all_count: number, interval: number = 1) {
        let c = 0
        nc.schedule(() => {
            if (c === 0) { f() }
            c += 1
            if (c >= interval) { c = 0 }
        }, 0, (all_count - 1) * interval)
    }

    /**
     * 获取节点的世界坐标
     * @param node 
     * @static
     */
    static get_node_world_position(node: cc.Node): cc.Vec2 {
        return node.getParent().convertToWorldSpaceAR(node.position)
    }

    /**
     * 将角度转换为弧度
     * @param angle 
     * @static
     */
    static trans_angle_to_radian(angle: number): number {
        return angle * (Math.PI / 180)
    }

    /**
     * 将弧度转换为角度
     * @param radian 
     * @static
     */
    static trans_radian_to_angle(radian: number): number {
        return radian / (Math.PI / 180)
    }

    /**
     * 异步函数中等待一段时间
     * @param time 单位s
     * @static
     * @async
     */
    static async wait_time(time: number) {
        return new Promise((resolve, reject) => { setTimeout(resolve, time * 1000) })
    }
}
