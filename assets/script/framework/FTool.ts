/**
 * [framework] 全局方法类
 * - 封装一些通用方法
 * @todo 对这些方法进行分类
 */
export namespace FTool {

    /**
     * 获取一个随机整数,[min,max),满足条件的整数出现概率相等;如果minb>max,我也不知道会返回啥
     * @param min
     * @param max
     */
    export function get_random_int(min: number, max: number) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min)
    }

    /**
     * 获取一个随机小数,[min,max);如果min>max,我也不知道会返回啥
     * @param min
     * @param max
     */
    export function get_random_float(min: number, max: number) {
        return Math.random() * (max - min) + min
    }

    /**
     * 获取一个随机数组项
     * @param array
     */
    export function get_random_array_item<T>(array: Array<T>): T {
        return array[Math.trunc(Math.random() * array.length)]
    }

    /** 随机字符数组,默认去掉了容易混淆的字符oO/9gq/Vv/Uu/LlI1 */
    const RANDOM_CHAR = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"

    /**
     * 随机字符串
     * @param length
     */
    export function get_random_string(length: number): string {
        let result = []
        for (let i = 0; i < length; i += 1) {
            result.push(RANDOM_CHAR[Math.trunc(Math.random() * RANDOM_CHAR.length)])
        }
        return result.join("")
    }

    /**
     * 采用洗牌算法打乱数组顺序,不更改原数组,返回一个打乱顺序的新数组
     * - 采用遍历+替换的方式。在数量级很大时,可能会有性能损耗
     * @param array
     */
    export function shuffle_array<T>(array: Array<T>): Array<T> {
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
    export async function do_with_frame(f: (index: number) => void, ccc: cc.Component, all_count: number, interval: number) {
        await new Promise(res => {
            let count = (all_count - 1) * interval  // 执行总帧数
            let frame_index = 0                     // 帧index
            let f_index = 0                         // 函数执行index
            ccc.schedule(() => {
                if (frame_index % interval === 0) {
                    f(f_index)
                    f_index += 1
                }
                frame_index += 1
                frame_index > count && res()
            }, 0, count)
        })
    }

    /**
     * 获取节点的世界坐标
     * @param node
     */
    export function get_node_world_position(node: cc.Node): cc.Vec2 {
        return node.convertToWorldSpaceAR(cc.Vec2.ZERO)
    }

    /**
     * 获取节点在世界坐标下对应的本地坐标
     * @param node
     * @param w_position
     */
    export function get_node_position_by_world_position(node: cc.Node, w_position: cc.Vec2) {
        return node.parent.convertToNodeSpaceAR(w_position)
    }

    /**
     * 计算两点之间的距离
     * @param p0
     * @param p1
     */
    export function get_2p_distance(p0: cc.Vec2, p1: cc.Vec2) {
        return p0.sub(p1).mag()
    }

    /**
     * 异步函数中等待一段时间
     * @param time 单位s
     */
    export async function wait_time(time: number) {
        await new Promise(res => setTimeout(res, time * 1e3))
    }

    /**
     * 显示一个多参数的模板字符串
     * @param template 伪模板字符串,使用{index}来表示参数,index表示参数序号;如果参数不存在,则使用undefined代替
     * @param params 多个参数;注意排序
     */
    export function get_template_string(template: string, ...params: string[]): string {
        return template.replace(/\{([0-9]+?)\}/g, (match, index) => params[index] || `\{${index}\}`)
    }

    /**
     * 手动刷新widget1次,并在刷新完毕后置于false
     * @param node
     */
    export function do_widget_once(node: cc.Node) {
        let w: cc.Widget = node.getComponent(cc.Widget)
        if (w && w.enabled) {
            w.updateAlignment()
            if (w.alignMode == cc.Widget.AlignMode.ONCE || w.alignMode == cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                w.enabled = false
            }
        }
    }

    /**
     * 判断两个数是否约等于
     * @param n0
     * @param n1
     * @param variance 精度,默认为1
     */
    export function is_number_fuzzy_equal(n0: number, n1: number, variance: number = 1): boolean {
        return Math.abs(n0 - n1) <= variance
    }

    /**
     * 截取数字的几位小数
     * @param n 源数字
     * @param count 小数位数
     */
    export function get_number_fixed(n: number, count: number = 1): number {
        return Math.trunc(n * 10 ** count) / 10 ** count
    }

    /**
     * 载入单个资源
     * @param path
     * @param type
     */
    export async function load_res<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>> {
        return await new Promise(res => {
            cc.loader.loadRes(path, type, (err, resource) => {
                err && cc.warn(`载入资源失败, path=${path}, err=${err}`)
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
    export async function load_res_dir<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>[]> {
        return await new Promise(res => {
            cc.loader.loadResDir(path, type, (err, resource) => {
                err && cc.warn(`载入资源组失败, path=${path}, err=${err}`)
                err ? res(null) : res(resource)
            })
        })
    }

    /**
     * 载入本地资源或网络资源
     * 1. 本地资源传入uuid
     * 2. 网络资源传入url,必要时传入type
     * @param params
     */
    export async function load_net_res(params: { uuid?: string, url?: string, type?: string }): Promise<any> {
        return await new Promise(res => {
            cc.loader.load(params, (err: Error, resource: any[]) => {
                err && cc.warn(`载入本地/网络资源失败, err=${err}, params=${params}`)
                err ? res(null) : res(resource)
            })
        })
    }

    /**
    * cc.misc.lerp的反向操作,获取value在min~max的lerp值
    * @param min
    * @param max
    * @param value
    */
    export function get_number_lerp(value: number, min: number, max: number) {
        return (value - min) / (max - min)
    }

    /**
     * 模运算,针对负数进行统一化
     * - [区别] n为正数时与%运算相同,n为负数:-1%10=-1;get_number_modulo(-1,10)=9
     * @param n
     */
    export function get_number_modulo(n: number, modulo: number): number {
        if (n < 0) {
            n += Math.max(modulo, modulo * Math.floor(-n))
        }
        return n % modulo
    }

}
