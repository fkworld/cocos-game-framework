import { MVersion } from "./MVersion";
import { PanelMessage } from "../panel/PanelMessage";

const C = {
    // 前缀，用来区分自定义的log信息和引擎\系统的log信息
    PREFIX_LOG: '@log:',
    PREFIX_WARN: '@warn:',
    PREFIX_ERROR: '@error:',
    PREFIX_MAJOR_ERROR: '@major-error:',
}

/**
 * [M] log信息管理工具
 * - 可以直接使用cc.log(),cc.warn(),cc.error()进行log输出
 * - 添加在log输出时进行的额外操作，包括记录信息，上传等
 * - [注意] MLog.log()没有函数调用的堆栈信息，如果需要，可以：
 *  1. 直接使用cc.log()调试
 *  2. 使用Chrome-Source进行调试
 *  3. 使用console.trace()输出堆栈信息
 * @todo 添加MLog的函数调用堆栈信息输出，管理
 */
export class MLog {

    /**
     * log信息
     * - 额外操作：无
     * @param param 
     * @static
     */
    static log(...message: any[]) {
        cc.log(C.PREFIX_LOG, ...message)
    }

    /**
     * warn信息
     * - 额外操作：无
     * @param line 
     * @static
     */
    static warn(...message: any[]) {
        cc.warn(C.PREFIX_WARN, ...message)
    }

    /**
     * error信息
     * - 额外操作
     *  * 在dev版本下弹出一个message窗口提示开发者
     * @param line
     * @static 
     */
    static error(...message: any[]) {
        cc.error(C.PREFIX_ERROR, ...message)
        if (MVersion.version_dev) {
            PanelMessage.open(`${message}`)
        }
    }

    /**
     * 重要error
     * - 额外操作
     *  - 在所有版本下均弹出一个窗口提示用户
     *  - 重启游戏
     * @param line 
     * @static
     */
    static major_error(...message: any[]) {
        cc.error(C.PREFIX_MAJOR_ERROR, ...message)
        PanelMessage.open(`${message}`)
        cc.game.restart()
    }
}