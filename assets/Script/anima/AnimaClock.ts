const { ccclass, property } = cc._decorator;
const C = {
    ANGLE: 45,
    INTERVAL: 0.1,
}

/**
 * [Anima] 时钟动画
 */
@ccclass
class AnimaClock extends cc.Component {

    onLoad() {
        this.set_anima()
    }

    @property({ tooltip: '每次转动角度' })
    angle: number = C.ANGLE

    @property({ tooltip: '转动间隔' })
    interval: number = C.INTERVAL

    set_anima() {
        this.schedule(() => {
            this.node.rotation += this.angle
        }, this.interval, cc.macro.REPEAT_FOREVER)
    }
}
