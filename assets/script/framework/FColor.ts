import { DataColor } from "../data/DataColor"

/**
 * 颜色数据模块
 * - [注意] 需要在数据源文件中实现 DataColor。
 * - [参考资料] Ant-design 推荐的颜色设计：https://ant.design/docs/spec/colors-cn。
 */
export namespace FColor {

    /** 所有颜色的 key */
    type ColorKey = keyof typeof DataColor

    /**
     * 从配置中获取颜色，如果无颜色，则返回白色
     * @param color_key
     */
    export function get_color(color_key: ColorKey): cc.Color {
        if (DataColor[color_key]) {
            return cc.color().fromHEX(DataColor[color_key])
        } else {
            cc.warn(`@FColor: 获取color失败，key=${color_key}`)
            return cc.Color.WHITE
        }
    }

}
