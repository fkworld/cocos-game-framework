const { ccclass, property } = cc._decorator
const C = {
    TOOLTIP: {
        TIME: '旋转一圈的时间（单位：s）',
    },
    /** 旋转一圈的时间 */
    DEFAULT_TIME: 5,
}
Object.freeze(C)

/**
 * 【框架-旋转】旋转动画
 */
@ccclass
class AnimaRotateForever extends cc.Component {

    /** @type {number} 旋转一圈的时间，单位s */
    @property({ tooltip: C.TOOLTIP.TIME })
    time = C.DEFAULT_TIME

    onLoad() {
        this.set_anima()
    }

    /** 设置动画 */
    set_anima() {
        this.node.stopAllActions()
        this.node.runAction(cc.rotateBy(this.time, 360).repeatForever())
    }
}