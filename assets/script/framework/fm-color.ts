import { FMVersion } from "./fm-version";
import { color, TypeColor } from "../data/color";
import { FMLog } from "./fm-log";

const { ccclass, property, menu } = cc._decorator;
const C = {
    COLOR: color,           // 数据
    DEFAULT_KEY: "none",    // 默认key;对应颜色为白色
}

/**
 * [T] 颜色工具
 * - [注意] 不在onLoad中执行,需要手动在编辑器中preview;如果未来有多个颜色配置文件,则需要在onLoad中执行.
 * - [参考资料] Ant-design推荐的颜色设计:https://ant.design/docs/spec/colors-cn
 */
@ccclass
@menu("framework/FMColor")
export class FMColor extends cc.Component {

    /**
     * 根据key获取颜色
     * @param key 
     */
    static get(key: keyof TypeColor): cc.Color {
        let color = C.COLOR[key]
        if (!color) {
            FMLog.warn(`@FMColor: color-key不存在, key=${key}`)
    }
        return color
    }

    @property({ tooltip: "颜色字符串" })
    private key: string = C.DEFAULT_KEY

    @property({ tooltip: "编辑器操作" })
    private get do_editor() { return false }
    private set do_editor(v: boolean) {
        FMVersion.is_editor && this.update_color()
    }

    private update_color() {
        this.node.color = FMColor.get(<any>this.key)
    }

}