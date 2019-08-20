import { color } from "../data/color";
import { FLog } from "./FLog";

/** 所有颜色的key */
type DataColorKey = keyof typeof color

/**
 * [framework] 颜色数据管理
 * - [参考资料] Ant-design推荐的颜色设计:https://ant.design/docs/spec/colors-cn
 */
export namespace FColor {

    /**
     * 获取颜色
     * @param color_key
     */
    export function get_color(color_key: DataColorKey): cc.Color {
        let result = color[color_key]
        if (!result) {
            FLog.warn(`@FColor: color-key不存在, key=${color_key}`)
        }
        return result
    }

}
