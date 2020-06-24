/**
 * 工具函数模块
 * - 与cocos creator相关的函数
 * @see https://www.yuque.com/fengyong/game-develop-road/ah2ypi
 */
/**
 * 适配canvas
 * - cc.winSize只有在适配后才能获取到正确的值，因此需要使用cc.getFrameSize来获取初始的屏幕大小
 * @since 1.0.0
 * @param canvas
 */
export declare function adjust_canvas(canvas: cc.Canvas): void;
/**
 * 刷新给定节点的widget
 * @since 1.0.0
 * @param node
 */
export declare function do_widget(node: cc.Node): void;
/**
 * 刷新给定节点下所有的widget
 * @since 1.0.0
 * @param node
 */
export declare function do_widget_all(node: cc.Node): void;
/**
 * schedule/scheduleOnce的封装
 * - 使用cc.Tween实现
 * - 使用cc.Tween.stopAllByTarget方法来取消
 * @since 1.0.0
 * @param target
 * @param interval 执行间隔，单位为s。
 * @param count 重复次数，包括首次。如果为0，则表示一直重复，此时会直接抛出res。
 * @param is_first 是否在启动时执行首次
 * @param f
 */
export declare function do_schedule(target: Record<string, unknown>, interval: number, count: number, is_first: boolean, f: (index: number) => void): Promise<void>;
/**
 * 获取节点的世界坐标
 * @since 1.0.0
 * @param node
 */
export declare function get_node_wp(node: cc.Node): cc.Vec3;
/**
 * 根据世界坐标设置节点本地坐标
 * @since 1.0.0
 * @param node
 * @param wp
 * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
 */
export declare function set_node_by_wp(node: cc.Node, wp: cc.Vec3, flag?: boolean): cc.Vec3;
/**
 * 载入单个资源
 * @since 1.0.0
 * @param resources
 */
export declare function load_async(resources: string | string[] | {
    type: "uuid";
    uuid?: string;
    url?: string;
}): Promise<any>;
/**
 * 载入resources下的单个资源
 * - 统一在运行时载入和在编辑器中载入
 * - 如果无此资源，则报错并返回undefined
 * @since 1.0.0
 * @param path 资源路径，以运行时路径为准
 * @param type
 */
export declare function load_res_async<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>>;
/**
 * 载入resources下某个文件夹下的所有资源
 * - 不同平台下的载入顺序不同，因此在载入完毕后需要进行排序
 * @since 1.0.0
 * @param path
 * @param type
 */
export declare function load_res_dir_async<T extends typeof cc.Asset>(path: string, type: T): Promise<InstanceType<T>[]>;
export declare const lineLine: typeof cc.Intersection.lineLine, lineRect: typeof cc.Intersection.lineRect, linePolygon: typeof cc.Intersection.linePolygon, rectRect: typeof cc.Intersection.rectRect, rectPolygon: typeof cc.Intersection.rectPolygon, polygonCircle: typeof cc.Intersection.polygonCircle, polygonPolygon: typeof cc.Intersection.polygonPolygon, circleCircle: typeof cc.Intersection.circleCircle, pointInPolygon: typeof cc.Intersection.pointInPolygon, pointLineDistance: typeof cc.Intersection.pointLineDistance;
export declare function pointInCircle(point: cc.Vec2, circle: {
    position: cc.Vec2;
    radius: number;
}): boolean;
/**
 * 获取无后缀的文件名
 * @since 1.0.0
 * @param path
 */
export declare function get_filename(path: string): void;
/**
 * 将resources下的路径转为编辑器url
 * @since 1.0.0
 * @param resources_path
 */
export declare function to_editor_url(path: string): string;
/**
 * 获取子节点
 * - 使用cc.find获取子节点
 * @since 1.0.0
 * @param n
 * @param childs 子节点类型
 * @param childs_path 子节点路径
 */
export declare function get_node_childs<T extends {
    [k: string]: typeof cc.Node | typeof cc.Component;
}>(n: cc.Node, childs: T, childs_path?: Partial<Record<keyof T, string>>): TypeChilds<T>;
/**
 * 子节点类型
 */
export declare type TypeChilds<T extends {
    [k: string]: typeof cc.Node | typeof cc.Component;
}> = {
    [k in keyof T]: T[k] extends typeof cc.Component ? InstanceType<T[k]> : cc.Node;
} & {
    self: cc.Node;
};
