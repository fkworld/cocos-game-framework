import G from "../framework/G";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, requireComponent } = cc._decorator;
const C = {
    TOOLTIP: {
        TIME: '动画持续总时间；默认为1s',
        INTERVAL: '动画间隔；默认为0.05s',
        TEMPLATE: '显示字符串模板；默认为{0}；如果为空也会视为{0}',
    },
    TIME: 1,
    INTERVAL: 0.05,
    TEMPLATE: '{0}',
}

/**
 * [Anima] 数字变动动画
 * - [注意] 使用到了unscheduleAllCallbacks()方法，可能会导致异常
 */
@ccclass
@requireComponent(cc.Label)
export default class AnimaNumber extends cc.Component {

    /**
     * 获取节点组件7
     * @param node 
     */
    static get(node: cc.Node) {
        return node.getComponent(AnimaNumber)
    }

    onLoad() {
        this.label = this.node.getComponent(cc.Label)
        this.reset_template()
    }

    label: cc.Label

    @property({ tooltip: C.TOOLTIP.TIME })
    time: number = C.TIME

    @property({ tooltip: C.TOOLTIP.INTERVAL })
    interval: number = C.INTERVAL

    @property({ tooltip: C.TOOLTIP.TEMPLATE })
    template: string = C.TEMPLATE

    /** 重置template */
    reset_template() {
        if (this.template === '') {
            this.template = '{0}'
        }
    }

    /**
     * 播放数字变动动画
     * @param from_value 初始值
     * @param to_value 最终值
     * @param time 持续时间
     * @param interval 变动间隔
     */
    play_anima(from_value, to_value, time: number = this.time, interval: number = this.interval) {
        if (from_value === to_value) { return }
        this.unscheduleAllCallbacks() // 避免重复调用时的bug，但是可能会导致取消了其他调度导致的异常
        let i = 0
        let count = Math.floor(time / interval)
        this.schedule(() => {
            i += 1
            let value = from_value + Math.trunc(i * (to_value - from_value) / count)
            this.label.string = G.fake_template_string(this.template, value)
        }, interval, count - 1)
    }
}
