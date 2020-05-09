/**
 * 封装的一些通用方法
 * - 自定义方法
 * - 封装引擎方法，使其具有完备的入参和出参，例如使用Promise封装cc.loader.loadRes
 * - 【注意】一些更基础的通用方法请使用lodash
 * - 【注意】一些项目独有的方法，单独再开一个模块
 */
export namespace FTool {

    /** 输出log */
    const TAG = "@FTool:"

    /**
     * 获取一个随机数组项，概率相同
     * @param array
     */
    export const get_random_array_item = <T>(array: Array<T>): T => {
        return array[Math.trunc(Math.random() * array.length)]
    }

    /**
     * 根据概率数组获取随机index
     * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
     * @param prob_array 概率数组
     */
    export const get_random_prob = (prob_array: number[]): number => {
        // 获取随机数
        let r = Math.random()
        // 对概率数组的处理
        let s = prob_array
            .map((v, index) => { return { index: index, prob: v } })
            .sort((a, b) => a.prob - b.prob)
        // 判断随机位置
        let result = s.find(v => (r -= v.prob) <= 0)
        return result ? result.index : s.length - 1
    }

    /**
     * 随机1次，判断是否满足给定概率
     * @param prob
     */
    export const is_prob = (prob: number) => {
        return Math.random() <= prob
    }

    /**
     * 求一个数的正数模
     * @param n
     * @param mode
     */
    export const get_positive_mode = (n: number, mode: number) => {
        return (n % mode + mode) % mode
    }

    /**
     * 刷新给定节点的widget
     * @param node
     */
    export const do_widget = (node: cc.Node) => {
        let w = node.getComponent(cc.Widget)
        if (w && w.enabled) {
            w.updateAlignment()
            if (w.alignMode === cc.Widget.AlignMode.ONCE
                || w.alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                w.enabled = false
            }
        }
    }

    /**
     * 刷新给定节点下所有的widget
     * @param node
     */
    export const do_widget_all = (node: cc.Node) => {
        node.getComponentsInChildren(cc.Widget).forEach(w => {
            if (w && w.enabled) {
                w.updateAlignment()
                if (w.alignMode === cc.Widget.AlignMode.ONCE
                    || w.alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                    w.enabled = false
                }
            }
        })
    }

    /**
     * 间隔帧执行
     * @param f 执行函数
     * @param ccc 执行组件
     * @param all_count 总计数
     * @param interval 间隔帧；默认为1，表示连续执行
     */
    export const do_with_frame = async (
        f: (index: number) => void,
        ccc: cc.Component,
        all_count: number,
        interval: number,
    ) => {
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
    export const get_node_wp = (node: cc.Node): cc.Vec3 => {
        return node.convertToWorldSpaceAR(cc.Vec3.ZERO)
    }

    /**
     * 根据世界坐标设置节点本地坐标
     * @param node
     * @param wp
     * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
     */
    export const set_node_by_wp = (node: cc.Node, wp: cc.Vec3, flag = false) => {
        let lp = node.parent.convertToNodeSpaceAR(wp)
        flag && (node.position = lp)
        return lp
    }

    /**
     * 等待n秒
     * @param time 单位s
     */
    export const wait_time = async (time: number) => {
        await new Promise(res => setTimeout(res, time * 1e3))
    }

    /**
     * 等待执行
     * @param f_do 执行函数
     * @param f_is 判定函数
     * @param wait_all 最高等待时间
     * @param wait_interval 等待间隔
     */
    export const wait_for_do = async (f_do: Function, f_is: Function, wait_all = 5, wait_interval = 0.5) => {
        let time = 0
        for (let i = 0; i < 100; i += 1) {
            if (!!f_is()) {
                f_do()
                break
            } else {
                time += wait_interval
                if (time >= wait_all) {
                    break
                }
                await wait_time(wait_interval)
            }
        }
    }

    /**
     * 带参数的自定义模版字符串
     * @param template 自定义模板字符串，使用{index}来表示参数，index表示参数序号
     * @param params 多个参数
     * @example
     * ```
     * let template = "My name is {0}, my age is {1}, my sex is {2}."
     * let params = ["fy", "16"]
     * get_template_string(template, ...params)
     * // => My name is fy, my age is 16, my sex is {2}.
     * ```
     */
    export const get_template_string = (template: string, ...params: string[]): string => {
        return template.replace(/\{([0-9]+?)\}/g, (match, index) => params[index] ?? `\{${index}\}`)
    }

    /**
     * 载入单个资源
     * - 既可以在editor中载入，也可以在运行时载入，但载入方式有差异
     * - 如果无此资源，则报错并返回null
     * - 【注意】运行时载入时无需传入文件后缀名，编辑器中载入需要有后缀名
     * - 【注意】在编辑器中载入
     * @param path
     * @param type
     */
    export const load_res = async <T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>> => {
        return await new Promise(res => {
            if (CC_EDITOR) {
                // 在编辑器中载入
                let url = `db://assets/resources/${path}`
                // 针jpg和png资源完善路径
                if (new cc.SpriteFrame() instanceof type) {
                    url = url + "/" + get_filename(url)
                }
                let uuid = Editor.assetdb.remote.urlToUuid(url)
                cc.loader.load({ type: "uuid", uuid: uuid }, (err: any, resource: any) => {
                    err && cc.warn(TAG, `载入资源失败, path=${path}, err=${err}`)
                    err ? res(null) : res(resource)
                })
            } else {
                // 运行时载入
                // 后缀名处理：去掉后缀名
                path = get_filepath(path) + get_filename(path)
                cc.loader.loadRes(path, type, (err, resource) => {
                    err && cc.warn(TAG, `载入资源失败, path=${path}, err=${err}`)
                    err ? res(null) : res(resource)
                })
            }
        })
    }

    /**
     * 载入dir资源
     * - 【注意】编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
     * @param path
     * @param type
     */
    export const load_res_dir = async <T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>[]> => {
        return await new Promise(res => {
            cc.loader.loadResDir(path, type, (err, resource) => {
                err && cc.warn(TAG, `载入资源组失败, path=${path}, err=${err}`)
                err ? res(null) : res(resource)
            })
        })
    }

    // cc.Intersection
    export const lineLine = cc.Intersection.lineLine
    export const lineRect = cc.Intersection.lineRect
    export const linePolygon = cc.Intersection.linePolygon
    export const rectRect = cc.Intersection.rectRect
    export const rectPolygon = cc.Intersection.rectPolygon
    export const polygonPolygon = cc.Intersection.polygonPolygon
    export const polygonCircle = cc.Intersection.polygonCircle
    export const circleCircle = cc.Intersection.circleCircle
    export const pointInPolygon = cc.Intersection.pointInPolygon
    export const pointLineDistance = cc.Intersection.pointLineDistance
    export const pointInCircle = (point: cc.Vec2, circle: { position: cc.Vec2, radius: number }) => {
        return point.sub(circle.position).len() <= circle.radius
    }

    /**
     * 获取url路径中的路径部分
     * @param path
     * @example
     * ```
     * let path = "resources/icon/test.png"
     * get_filepath(path)
     * //=> resources/icon/
     * ```
     */
    export const get_filepath = (path: string) => {
        let r = path.match(/.+(?=\/[^\/]+$)/)
        return r ? r[0] : ""
    }

    /**
     * 获取url路径中的文件名部分
     * @param path
     * @example
     * ```
     * let path = "resources/icon/test.png"
     * get_filename(path)
     * //=> test
     * ```
     */
    export const get_filename = (path: string) => {
        let r = path.match(/[^\/]+(?=\.[^\.]+$)/)
        return r ? r[0] : ""
    }

    /**
     * 获取url路径中的文件后缀名部分
     * @param path
     * @example
     * ```
     * let path = "resources/icon/test.png"
     * get_extname(path)
     * //=> .png
     * ```
     */
    export const get_extname = (path: string) => {
        let r = path.match(/\.[^\.]+$/)
        return r ? r[0] : ""
    }

}
