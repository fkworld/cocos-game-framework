import { color, TypeColor } from "../data/color";
import { FLog } from "./FLog";

const C = {
    COLOR: color,           // 数据
}

/**
 * - [参考资料] Ant-design推荐的颜色设计:https://ant.design/docs/spec/colors-cn
 */
export class FColor {

    /**
     * 根据key获取颜色
     * @param key 
     */
    static get(key: keyof TypeColor): cc.Color {
        let color = C.COLOR[key]
        if (!color) {
            FLog.warn(`@FColor: color-key不存在, key=${key}`)
        }
        return color
    }

}