import { DataColor } from "../data/DataColor"

/**
 * 颜色数据模块
 * - *注意* 需要在数据源文件中实现 DataColor。
 * - *参考资料* Ant-design 推荐的颜色设计：https://ant.design/docs/spec/colors-cn。
 */
export namespace FColor {

    /** 所有颜色的 key */
    type TypeColorKey = keyof typeof DataColor

    /**
     * 获取颜色
     * @param color_key
     */
    export function get_color(color_key: TypeColorKey): cc.Color {
        try {
            return cc.color().fromHEX(DataColor[color_key])
        } catch (error) {
            cc.warn(`@FColor: 获取color失败，key=${color_key}，error=${error}`)
        }
    }

}
