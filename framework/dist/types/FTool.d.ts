/**
 * 封装的一些通用方法
 * - 自定义方法
 * - 封装引擎方法，使其具有完备的入参和出参，例如使用Promise封装cc.loader.loadRes
 * - 【注意】一些更基础的通用方法请使用lodash
 * - 【注意】一些项目独有的方法，单独再开一个模块
 */
export declare namespace FTool {
    /**
     * 获取一个随机数组项，概率相同
     * @param array
     */
    const get_random_array_item: <T>(array: T[]) => T;
    /**
     * 根据概率数组获取随机index
     * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
     * @param prob_array 概率数组
     */
    const get_random_prob: (prob_array: number[]) => number;
    /**
     * 随机1次，判断是否满足给定概率
     * @param prob
     */
    const is_prob: (prob: number) => boolean;
    /**
     * 求一个数的正数模
     * @param n
     * @param mode
     */
    const get_positive_mode: (n: number, mode: number) => number;
    /**
     * 刷新给定节点的widget
     * @param node
     */
    const do_widget: (node: cc.Node) => void;
    /**
     * 刷新给定节点下所有的widget
     * @param node
     */
    const do_widget_all: (node: cc.Node) => void;
    /**
     * 间隔帧执行
     * @param f 执行函数
     * @param ccc 执行组件
     * @param all_count 总计数
     * @param interval 间隔帧；默认为1，表示连续执行
     */
    const do_with_frame: (f: (index: number) => void, ccc: cc.Component, all_count: number, interval: number) => Promise<void>;
    /**
     * 获取节点的世界坐标
     * @param node
     */
    const get_node_wp: (node: cc.Node) => cc.Vec3;
    /**
     * 根据世界坐标设置节点本地坐标
     * @param node
     * @param wp
     * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
     */
    const set_node_by_wp: (node: cc.Node, wp: cc.Vec3, flag?: boolean) => cc.Vec3;
    /**
     * 等待n秒
     * @param time 单位s
     */
    const wait_time: (time: number) => Promise<void>;
    /**
     * 等待执行
     * @param f_do 执行函数
     * @param f_is 判定函数
     * @param wait_all 最高等待时间
     * @param wait_interval 等待间隔
     */
    const wait_for_do: (f_do: Function, f_is: Function, wait_all?: number, wait_interval?: number) => Promise<void>;
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
    const get_template_string: (template: string, ...params: string[]) => string;
    /**
     * 载入单个资源
     * - 既可以在editor中载入，也可以在运行时载入，但载入方式有差异
     * - 如果无此资源，则报错并返回null
     * - 【注意】运行时载入时无需传入文件后缀名，编辑器中载入需要有后缀名
     * - 【注意】在编辑器中载入
     * @param path
     * @param type
     */
    const load_res: <T extends typeof cc.Asset>(path: string, type: T) => Promise<InstanceType<T>>;
    /**
     * 载入dir资源
     * - 【注意】编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
     * @param path
     * @param type
     */
    const load_res_dir: <T extends typeof cc.Asset>(path: string, type: T) => Promise<InstanceType<T>[]>;
    const lineLine: typeof cc.Intersection.lineLine;
    const lineRect: typeof cc.Intersection.lineRect;
    const linePolygon: typeof cc.Intersection.linePolygon;
    const rectRect: typeof cc.Intersection.rectRect;
    const rectPolygon: typeof cc.Intersection.rectPolygon;
    const polygonPolygon: typeof cc.Intersection.polygonPolygon;
    const polygonCircle: typeof cc.Intersection.polygonCircle;
    const circleCircle: typeof cc.Intersection.circleCircle;
    const pointInPolygon: typeof cc.Intersection.pointInPolygon;
    const pointLineDistance: typeof cc.Intersection.pointLineDistance;
    const pointInCircle: (point: cc.Vec2, circle: {
        position: cc.Vec2;
        radius: number;
    }) => boolean;
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
    const get_filepath: (path: string) => string;
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
    const get_filename: (path: string) => string;
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
    const get_extname: (path: string) => string;
}
