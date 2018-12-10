const { ccclass, requireComponent } = cc._decorator
const C = {

}
Object.freeze(C)

/**
 * [framework-Anima] 简单数字倒计时动画
 */
@ccclass
@requireComponent(cc.Label)
export default class AnimaCountDown extends cc.Component {

    static get(node) { return node.getComponent(AnimaCountDown) }

    /** label组件 */
    label: cc.Label

    onLoad() {
        this.label = this.node.getComponent(cc.Label)
        this.node.active = false
    }

    /**
     * 播放倒计时
     * @param from_number 
     * @param to_number 目标数字；默认为0；要求from_number>to_number
     * @param f 倒计时完毕后的执行方法
     */
    play_anima(from_number: number, to_number: number = 0, f: Function = () => { }) {
        this.unscheduleAllCallbacks()
        let now_number = from_number
        this.label.string = `${now_number}`
        this.node.active = true
        this.schedule(() => {
            now_number -= 1
            this.label.string = `${now_number}`
            if (now_number <= to_number) {
                this.node.active = false
                f()
            }
        }, 1, from_number - to_number)
    }

}