const { ccclass, property } = cc._decorator

/**
 * 框架文件：音频管理类
 * - 封装调用的方法
 */
@ccclass
export default class MAudio extends cc.Component {

    onLoad() {
        MAudio.instance = this
    }

    /** @type {MAudio} */
    static get ins() { return MAudio.instance }
}