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
     * 计算两点之间的距离
     * - 有开平方计算，可能会有额外的性能损耗
     * @param p0 
     * @param p1 
     * @static
     */
    static get_p_p_distance(p0: cc.Vec2, p1: cc.Vec2) {
        return p0.sub(p1).mag()
    }

    /**
     * 计算点到一个线段的最短距离
     * - 注意是线段而非直线
     * - 矢量法
     * @param p 
     * @param p0 
     * @param p1 
     * @static
     */
    static get_p_line_distance(p: cc.Vec2, p0: cc.Vec2, p1: cc.Vec2) {
        const line = p1.sub(p0)                 // 线段矢量
        const p_line = p.sub(p0)                // 线段起点到外部点矢量
        const p_shadow = p_line.project(line)   // 投影矢量
        const dot_value = p_line.dot(line)      // 向量点乘值
        let result: number;
        if (dot_value >= 0) {
            // >=0表示夹角为直角或者锐角
            if (p_shadow.mag() >= line.mag()) {
                result = p_line.sub(line).mag()
            } else {
                result = p_line.sub(p_shadow).mag()
            }
        } else {
            // <0表示夹角为钝角
            result = p_line.mag()
        }
        return result
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

    /**
     * 显示一个多参数的模板字符串
     * @param template 伪模板字符串，使用{index}来表示参数，index表示参数序号
     * @param params 多个参数；注意排序
     * @static
     * @example
    ```ts
    const s = 'this is {0}, and {this1} is {1}, {1}, {2}'
    const r = MLanguage.fake_template_string(s, 'param0', 'param1')
    console.log(r)
    => 'this is param0, and {this1} is param1, param1, undefined'
    ```
     */
    static fake_template_string(template: string, ...params: any[]): string {
        const reg = /\{([0-9]+?)\}/g
        return template.replace(reg, (match, index) => params[index])
    }
}
