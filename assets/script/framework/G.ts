/**
 * [framework] 全局方法类
 * - 封装一些通用方法
 * @todo 对这些方法进行分类
 */
export class G {

    /**
     * 获取一个随机整数,[min,max),满足条件的整数出现概率相等;如果min>=max则返回异常
     * @param min 
     * @param max 
     */
    static random_int(min: number, max: number) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
    }

    /**
     * 获取一个随机小数,[min,max);如果min>=max则返回异常
     * @param min 
     * @param max 
     */
    static random_float(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    /**
     * 获取一个随机数组项
     * @param array 
     */
    static random_array_item<T>(array: Array<T>): T {
        return array[Math.trunc(Math.random() * array.length)]
    }

    /**
     * 获取一个随机枚举项,仅限于typescript,且须从0开始
     * @param array_enum 
     */
    static random_enum_item(array_enum: any) {
        return Math.trunc(Math.random() * Object.keys(array_enum).length / 2)
    }

    /**
     * 采用洗牌算法打乱数组顺序,不更改原数组,返回一个打乱顺序的新数组
     * - 采用遍历+替换的方式。在数量级很大时,可能会有性能损耗
     * @param array 
     */
    static shuffle_array<T>(array: Array<T>): Array<T> {
        let result = [...array]
        for (let i = 0; i < result.length; i += 1) {
            let t = Math.trunc(Math.random() * result.length);
            [result[i], result[t]] = [result[t], result[i]];
        }
        return result
    }

    /**
     * 间隔帧执行
     * @param f 
     * @param nc 
     * @param all_count 
     * @param interval 间隔帧;默认为1,表示连续帧
     */
    static run_by_interval_frame(f: () => void, ccc: cc.Component, all_count: number, interval: number) {
        return new Promise(res => {
            let i = 0
            let count = (all_count - 1) * interval
            ccc.schedule(() => {
                i % interval === 0 && f()
                i += 1
                i > count && res()
            }, 0, count)
        })
    }

    /**
     * 获取节点的世界坐标
     * @param node 
     */
    static get_node_world_position(node: cc.Node): cc.Vec2 {
        return node.convertToWorldSpaceAR(cc.Vec2.ZERO)
    }

    /**
     * 获取节点的在其父节点坐标系中的本地坐标
     * - [注意] 描述的有点绕,请注意本地坐标系的原点是node.parent
     * @param node 
     * @param w_position 
     */
    static get_node_local_position(node: cc.Node, w_position: cc.Vec2) {
        return node.parent.convertToNodeSpaceAR(w_position)
    }

    /**
     * 将角度转换为弧度
     * - cc.misc.degreesToRadians()
     * @param angle 
     */
    static trans_angle_to_radian(angle: number): number {
        return angle * (Math.PI / 180)
    }

    /**
     * 将弧度转换为角度
     * - cc.misc.radiansToDegrees()
     * @param radian 
     */
    static trans_radian_to_angle(radian: number): number {
        return radian / (Math.PI / 180)
    }

    /**
     * 计算两点之间的距离
     * - 有开平方计算,可能会有额外的性能损耗
     * @param p0 
     * @param p1 
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
     */
    static get_p_line_distance(p: cc.Vec2, p0: cc.Vec2, p1: cc.Vec2) {
        let line = p1.sub(p0)                 // 线段矢量
        let p_line = p.sub(p0)                // 线段起点到外部点矢量
        let p_shadow = p_line.project(line)   // 投影矢量
        let dot_value = p_line.dot(line)      // 向量点乘值
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
     */
    static wait_time(time: number) {
        return new Promise(res => setTimeout(res, time * 1e3))
    }

    /**
     * 显示一个多参数的模板字符串
     * @param template 伪模板字符串,使用{index}来表示参数,index表示参数序号
     * @param params 多个参数;注意排序
     * @example
    ```
    let s = "this is {0}, and {this1} is {1}, {1}, {2}";
    let r = G.fake_template_string(s, "param0", "param1");
    console.log(r); // "this is param0, and {this1} is param1, param1, undefined"
    ```
     */
    static fake_template_string(template: string, ...params: string[]): string {
        return template.replace(/\{([0-9]+?)\}/g, (match, index) => params[index] || `\{${index}\}`)
    }

    /**
     * 验证目标类的ins实例是否唯一
     * @todo 可能考虑使用装饰器实现
     * @param target 
     */
    static check_ins(target: any) {
        target.ins && cc.error(`@${target.name}: repeat init ins, please check`)
    }

    /**
     * 手动刷新widget1次,并在刷新完毕后置于false
     * @param node 
     */
    static check_widget(node: cc.Node) {
        let w: cc.Widget = node.getComponent(cc.Widget)
        if (w && w.enabled) {
            w.updateAlignment()
            if (w.alignMode == cc.Widget.AlignMode.ONCE || w.alignMode == cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                w.enabled = false
            }
        }
    }

    /**
     * 两数字间的线性求值,比例范围：[0,1]
     * - cc.misc.lerp()
     * @param start 
     * @param end 
     * @param ratio 
     */
    static number_lerp(start: number, end: number, ratio: number) {
        return start + (end - start) * ratio
    }

    /**
     * 限制数字的最大最小值
     * - cc.misc.clampf()
     * @param value 
     * @param min_inclusive 
     * @param max_inclusive 
     */
    static number_clampf(value: number, min_inclusive: number, max_inclusive: number) {
        let min = Math.min(min_inclusive, max_inclusive)
        let max = Math.max(min_inclusive, max_inclusive)
        return value < min ? min : value < max ? value : max
    };

    /**
     * 判断两个数是否约等于
     * @param n0 
     * @param n1 
     * @param variance 精度,默认为1
     */
    static number_fuzzy_equal(n0: number, n1: number, variance: number = 1) {
        return Math.abs(n0 - n1) <= variance
    }

    /**
     * 截取数字的几位小数
     * @param n 源数字
     * @param count 小数位数
     */
    static number_fixed(n: number, count: number = 1) {
        return Math.trunc(n * 10 ** count) / 10 ** count
    }

    /**
     * 随机字符串
     * @param length 
     */
    static random_string(length: number): string {
        // 默认去掉了容易混淆的字符oO,9gq,Vv,Uu,LlI1
        let random_string_list = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
        let result = []
        for (let i = 0; i < length; i += 1) {
            result.push(random_string_list[Math.trunc(Math.random() * random_string_list.length)])
        }
        return result.join("")
    }

    /**
     * 载入单个资源
     * @param path 
     * @param type 
     */
    static load_res<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>> {
        return new Promise(res => {
            cc.loader.loadRes(path, type, (err, resource) => {
                err && cc.warn(`load res fail, path=${path}, err=${err}`)
                err ? res(null) : res(resource)
            })
        })
    }

    /**
     * 载入dir资源
     * - [注意] 编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
     * @param path 
     * @param type 
     */
    static load_res_dir<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>[]> {
        return new Promise(res => {
            cc.loader.loadResDir(path, type, (err, resource) => {
                err && cc.warn(`load res dir fail, path=${path}, err=${err}`)
                err ? res(null) : res(resource)
            })
        })
    }

    /**
     * 模运算,针对负数进行统一化
     * - [区别] n为正数时与%运算相同,n为负数:-1%10=-1;modulo_operation(-1,10)=9
     * @param n 
     */
    static modulo_operation(n: number, module: number): number {
        if (n < 0) {
            n += Math.max(module, module * Math.floor(-n))
        }
        return n % module
    }

    /**
     * 抖动
     * @param node 
     */
    static shake(node: cc.Node) {
        return new Promise(res => {
            let base_position = node.position
            node.runAction(cc.sequence(
                cc.moveTo(0.02, base_position.add(cc.v2(5, 7))),
                cc.moveTo(0.02, base_position.add(cc.v2(-6, 7))),
                cc.moveTo(0.02, base_position.add(cc.v2(-13, 3))),
                cc.moveTo(0.02, base_position.add(cc.v2(3, -6))),
                cc.moveTo(0.02, base_position.add(cc.v2(-5, 5))),
                cc.moveTo(0.02, base_position.add(cc.v2(2, -8))),
                cc.moveTo(0.02, base_position.add(cc.v2(-8, -10))),
                cc.moveTo(0.02, base_position.add(cc.v2(3, 10))),
                cc.moveTo(0.02, base_position.add(cc.v2(0, 0))),
                cc.callFunc(res)
            ))
        })
    }

}