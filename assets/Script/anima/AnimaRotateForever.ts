const { ccclass, property } = cc._decorator
const C = {
    TOOLTIP: {
        TIME: '旋转一圈的时间；单位s',
    },
    DEFAULT_TIME: 5,
}
Object.freeze(C)

/**
 * [framework-anima] 旋转动画
 */
@ccclass
class AnimaRotateForever extends cc.Component {

    onLoad() {
        this.set_anima()
    }

    /** 旋转一圈的时间 */
    @property({ tooltip: C.TOOLTIP.TIME })
    time: number = C.DEFAULT_TIME

    /** 设置动画 */
    set_anima() {
        this.node.stopAllActions()
        this.node.runAction(cc.rotateBy(this.time, 360).repeatForever())
    }
}