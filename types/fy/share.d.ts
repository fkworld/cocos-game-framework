/** 输出log */
export declare const TAG = "@fy:";
/**
 * 获取一个随机值
 * @param min
 * @param max
 * @param floating 为true则表示返回整数，默认为false
 * @deprecated 建议使用lodash/random代替
 */
export declare const random: (min: number, max: number, floating?: boolean) => number;
/**
 * 获取一个随机数组项，概率相同
 * @param array
 * @deprecated 建议使用lodash/sample代替
 */
export declare const random_array_item: <T>(array: T[]) => T;
/**
 * 根据概率数组获取随机index
 * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
 * @param prob_array 概率数组
 */
export declare const random_prob: (prob_array: number[]) => number;
/**
 * 随机1次，判断是否满足给定概率
 * @param prob
 */
export declare const is_prob: (prob: number) => boolean;
/**
 * 求一个数的正数模
 * @param n
 * @param mode
 */
export declare const get_positive_mode: (n: number, mode: number) => number;
/**
 * 刷新给定节点的widget
 * @param node
 */
export declare const do_widget: (node: cc.Node) => void;
/**
 * 刷新给定节点下所有的widget
 * @param node
 */
export declare const do_widget_all: (node: cc.Node) => void;
/**
 * 间隔帧执行
 * @param f 执行函数
 * @param all_count 总计数
 * @param interval 间隔帧；默认为1，表示连续执行
 * @param target 执行组件
 */
export declare const do_with_frame: (f: (index: number) => void, all_count: number, interval: number, target: cc.Component) => Promise<void>;
/**
 * 获取节点的世界坐标
 * @param node
 */
export declare const get_node_wp: (node: cc.Node) => cc.Vec3;
/**
 * 根据世界坐标设置节点本地坐标
 * @param node
 * @param wp
 * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
 */
export declare const set_node_by_wp: (node: cc.Node, wp: cc.Vec3, flag?: boolean) => cc.Vec3;
/**
 * 等待n秒
 * @param time 单位s
 */
export declare const do_delay: (time: number) => Promise<void>;
/**
 * 等待执行
 * @param f_do 执行函数
 * @param f_is 判定函数
 * @param wait_all 最高等待时间
 * @param wait_interval 等待间隔
 */
export declare const wait_for_do: (f_do: Function, f_is: Function, wait_all?: number, wait_interval?: number) => Promise<void>;
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
export declare const get_template_string: (template: string, ...params: string[]) => string;
/**
 * 载入单个资源
 * - 既可以在editor中载入，也可以在运行时载入，但载入方式有差异
 * - 如果无此资源，则报错并返回null
 * - 【注意】运行时载入时无需传入文件后缀名，编辑器中载入需要有后缀名
 * - 【注意】在编辑器中载入
 * @param path
 * @param type
 */
export declare const load_res: <T extends typeof cc.Asset>(path: string, type: T) => Promise<InstanceType<T>>;
/**
 * 载入dir资源
 * - 【注意】编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
 * @param path
 * @param type
 */
export declare const load_res_dir: <T extends typeof cc.Asset>(path: string, type: T) => Promise<InstanceType<T>[]>;
export declare const lineLine: typeof cc.Intersection.lineLine;
export declare const lineRect: typeof cc.Intersection.lineRect;
export declare const linePolygon: typeof cc.Intersection.linePolygon;
export declare const rectRect: typeof cc.Intersection.rectRect;
export declare const rectPolygon: typeof cc.Intersection.rectPolygon;
export declare const polygonPolygon: typeof cc.Intersection.polygonPolygon;
export declare const polygonCircle: typeof cc.Intersection.polygonCircle;
export declare const circleCircle: typeof cc.Intersection.circleCircle;
export declare const pointInPolygon: typeof cc.Intersection.pointInPolygon;
export declare const pointLineDistance: typeof cc.Intersection.pointLineDistance;
export declare const pointInCircle: (point: cc.Vec2, circle: {
    position: cc.Vec2;
    radius: number;
}) => boolean;
/**
 * 获取url中的路径部分
 * @param path
 * @example
 * ```
 * get_dirname("resources/icon/test.png")   //=> resources/icon/
 * ```
 */
export declare const get_dirname: (path: string) => string;
/**
 * 获取url中的文件名部分
 * @param path
 * @example
 * ```
 * get_filename("resources/icon/test.png")  //=> test
 * get_filename("resources/icon/test")      //=> test
 * ```
 */
export declare const get_filename: (path: string) => string;
/**
 * 获取url中的文件后缀名部分
 * @param path
 * @example
 * ```
 * get_extname("resources/icon/test.png")   //=> .png
 * ```
 */
export declare const get_extname: (path: string) => string;
