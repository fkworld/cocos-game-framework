/**
 * 颜色管理模块
 * - 使用key-value形式存储，其中value为颜色的hex值，前6位表示颜色，后2位表示透明度，后2位省略表示透明度为255
 * - 【参考资料】 Ant-design推荐的颜色设计：https://ant.design/docs/spec/colors-cn
 */
export namespace FColor {

    /** 输出log */
    const TAG = "@FColor:"

    /** 颜色配置 */
    export interface ConfigColor {
        none: "FFFFFF",
        [k: string]: string,
    }

    /**
     * 需要在运行时初始化
     * @param config
     */
    export const init = (config: ConfigColor) => {
        data = config
    }

    /**
     * 需要在编辑器中初始化
     * @param config
     */
    export const init_editor = (config: ConfigColor) => {
        CC_EDITOR && (data = config)
    }

    let data: ConfigColor

    /**
     * 从配置中获取颜色，如果无颜色，则返回白色
     * @param color_key
     */
    export const get_color = (color_key: string): cc.Color => {
        if (data[color_key]) {
            return cc.color().fromHEX(data[color_key])
        } else {
            cc.warn(TAG, `获取color失败，key=${color_key}`)
            return cc.Color.WHITE
        }
    }

}
