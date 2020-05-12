// 颜色模块

import { TAG } from "./share"

/**
 * 颜色配置
 * - value为颜色的hex值，可以包含透明度
 */
export interface ConfigColor {
    /** 默认颜色 */
    none: "FFFFFF",
    [k: string]: string,
}

/** 颜色配置表 */
let colors: ConfigColor

/**
 * 在运行时初始化颜色模块
 * @param config
 */
export const init_color_runtime = (config: ConfigColor) => {
    colors = config
}

/**
 * 需要在编辑器中初始化
 * @param config
 */
export const init_color_editor = (config: ConfigColor) => {
    CC_EDITOR && (colors = config)
}

/**
 * 从配置中获取颜色，如果无颜色，则返回白色
 * @param color_key
 */
export const get_color = (color_key: string): cc.Color => {
    if (colors[color_key]) {
        return cc.color().fromHEX(colors[color_key])
    } else {
        cc.warn(TAG, `获取color失败，key=${color_key}`)
        return cc.Color.WHITE
    }
}
