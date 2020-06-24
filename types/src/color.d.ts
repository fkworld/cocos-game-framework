/**
 * 颜色模块
 * - 需要初始化，传入颜色配置数据
 * @see https://www.yuque.com/fengyong/game-develop-road/wiomdz
 */
/**
 * 颜色配置
 * @property key 颜色key
 * @property value 颜色hex字符串
 */
export interface ColorConfig {
    [k: string]: string;
}
/**
 * 初始化
 * @since 1.0.0
 * @param config
 */
export declare function _init_color(config?: ColorConfig): void;
/**
 * 从配置中获取颜色，如果无颜色，则返回白色
 * @since 1.0.0
 * @param color_key
 */
export declare function get_color(color_key: string): cc.Color;
/**
 * 设置节点颜色
 * @since 1.0.0
 * @param node
 * @param color_key
 */
export declare function set_node_color(node: cc.Node, color_key: string): void;
