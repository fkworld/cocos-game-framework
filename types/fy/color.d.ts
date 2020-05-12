/**
 * 颜色配置
 * - value为颜色的hex值，可以包含透明度
 */
export interface ConfigColor {
    /** 默认颜色 */
    none: "FFFFFF";
    [k: string]: string;
}
/**
 * 在运行时初始化颜色模块
 * @param config
 */
export declare const init_color_runtime: (config: ConfigColor) => void;
/**
 * 需要在编辑器中初始化
 * @param config
 */
export declare const init_color_editor: (config: ConfigColor) => void;
/**
 * 从配置中获取颜色，如果无颜色，则返回白色
 * @param color_key
 */
export declare const get_color: (color_key: string) => cc.Color;
