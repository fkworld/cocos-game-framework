const { ccclass, property } = cc._decorator

/**
 * 框架文件：音频管理类
 * - 封装调用的方法
 */
@ccclass
export default class MAudio extends cc.Component {

    /** @type {MAudio} */
    static ins

    onLoad() {
        MAudio.ins = this
    }
}