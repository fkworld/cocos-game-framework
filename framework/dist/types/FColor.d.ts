/**
 * 颜色管理模块
 * - 使用key-value形式存储，其中value为颜色的hex值，前6位表示颜色，后2位表示透明度，后2位省略表示透明度为255
 * - 【参考资料】 Ant-design推荐的颜色设计：https://ant.design/docs/spec/colors-cn
 */
export declare namespace FColor {
    /** 颜色配置 */
    interface ConfigColor {
        none: "FFFFFF";
        [k: string]: string;
    }
    /**
     * 需要在运行时初始化
     * @param config
     */
    const init: (config: ConfigColor) => void;
    /**
     * 需要在编辑器中初始化
     * @param config
     */
    const init_editor: (config: ConfigColor) => void;
    /**
     * 从配置中获取颜色，如果无颜色，则返回白色
     * @param color_key
     */
    const get_color: (color_key: string) => cc.Color;
}
