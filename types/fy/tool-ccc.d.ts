/**
 * 适配 canvas
 * - 【注意】cc.winSize 只有在适配后才能获取到正确的值，因此需要使用 cc.getFrameSize 来获取初始的屏幕大小
 * @param canvas
 */
export declare const adjust_canvas: (canvas: cc.Canvas) => void;
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
export declare const pointInCircle: (point: cc.Vec2, circle: CCCCircle) => boolean;
/** 在 ccc 中表示一个圆 */
export interface CCCCircle {
    position: cc.Vec2;
    radius: number;
}
/**
 * 获取无后缀的文件名
 * @param path
 */
export declare const get_filename: (path: string) => any;
