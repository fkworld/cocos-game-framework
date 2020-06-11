/**
 * 颜色模块
 * - 需要在编辑器中和运行时初始化
 */
/**
 * 颜色配置
 * - value 颜色的hex值，可以包含透明度
 */
export interface ConfigColor {
    /** 默认颜色 */
    none: string;
    [k: string]: string;
}
export declare function _init_color(config?: ConfigColor): void;
/**
 * 从配置中获取颜色，如果无颜色，则返回白色
 * @param color_key
 */
export declare function get_color(color_key: string): cc.Color;
/**
 * 设置节点颜色
 * @param node
 * @param color_key
 */
export declare function set_node_color(node: cc.Node, color_key: string): void;
