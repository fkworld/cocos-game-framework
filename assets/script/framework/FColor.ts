import { DataColor, DataColorKey } from "../data/DataColor"

/**
 * [framework] 颜色数据管理
 * - [注意] 需要在数据源文件中实现 DataColor 和 DataColorKey。
 * - [参考资料] Ant-design推荐的颜色设计:https://ant.design/docs/spec/colors-cn
 */
export namespace FColor {

    /**
     * 获取颜色
     * @param color_key
     */
    export function get_color(color_key: DataColorKey): cc.Color {
        let result = DataColor[color_key]
        if (!result) {
            cc.warn(`@FColor: color-key不存在, key=${color_key}`)
        }
        return result
    }

}
