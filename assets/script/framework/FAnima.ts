import { G } from "./G";

const C = {
    TIME: 0.3,                          // 默认时间
    EASE_IN: cc.easeCubicActionOut(),   // 默认ease
    EASE_OUT: cc.easeCubicActionIn(),
    DIRECTION: {                        // 方向对应的元向量
        "left": cc.v2(-1, 0),
        "right": cc.v2(1, 0),
        "up": cc.v2(0, 1),
        "down": cc.v2(0, -1),
        "left_up": cc.v2(-1, 1),
        "left_down": cc.v2(-1, -1),
        "right_up": cc.v2(1, 1),
        "right_down": cc.v2(1, -1),
    },
    FADE_MOVE_DISTANCE: 100,            // 在fade-move模式下的移动距离
    FADE_SCALE_TARGET: 2,               // 在fade-scale模式下的目标scale
}

/** 方向类型 */
type TypeDirection = keyof typeof C.DIRECTION;
/** ui动作的基础参数 */
interface ParamsAction {
    time?: number;      // 时间
    delay?: number;     // 延迟
    ease?: any;         // ease函数
}


/**
 * [M] 动画管理
 * - 封装一些简单的常用的动画
 */
export class FAnima {

    /**
     * 时钟动画：每次转动一定的角度
     * @param node 
     * @param angle 
     * @param interval 
     */
    static clock(node: cc.Node, angle: number, interval: number, count: number) {
        node.runAction(cc.sequence(
            cc.callFunc(() => { node.rotation += angle }),
            cc.delayTime(interval),
        ).repeat(count))
    }

    /**
     * 倒计时动画
     * @param label 
     * @param n 
     */
    static count_down(label: cc.Label, n: number) {
        return new Promise(res => {
            label.string = `${n}`
            label.node.scale = 0
            label.node.active = true
            label.node.runAction(cc.sequence(
                cc.delayTime(0.6),
                cc.scaleTo(0.2, 0).easing(cc.easeBackIn()),
                cc.callFunc(() => {
                    n -= 1
                    label.string = `${n}`
                    if (n < 0) {
                        label.node.stopAllActions()
                        res()
                    }
                }),
                cc.scaleTo(0.2, 1).easing(cc.easeBounceOut()),
            ).repeatForever())
        })
    }

    /**
     * 抖动
     * @param node 
     */
    static shake(node: cc.Node) {
        return new Promise(res => {
            let base_position = node.position
            node.runAction(cc.sequence(
                cc.moveTo(0.02, base_position.add(cc.v2(5, 7))),
                cc.moveTo(0.02, base_position.add(cc.v2(-6, 7))),
                cc.moveTo(0.02, base_position.add(cc.v2(-13, 3))),
                cc.moveTo(0.02, base_position.add(cc.v2(3, -6))),
                cc.moveTo(0.02, base_position.add(cc.v2(-5, 5))),
                cc.moveTo(0.02, base_position.add(cc.v2(2, -8))),
                cc.moveTo(0.02, base_position.add(cc.v2(-8, -10))),
                cc.moveTo(0.02, base_position.add(cc.v2(3, 10))),
                cc.moveTo(0.02, base_position.add(cc.v2(0, 0))),
                cc.callFunc(res)
            ))
        })
    }


    //////////
    // 配置的默认数值
    //////////

    static get_time() { return C.TIME }
    static get_ease_in() { return C.EASE_IN }
    static get_ease_out() { return C.EASE_OUT }

    //////////
    // UI方法,使用Promise封装动画过程
    //////////

    /** 
     * 直接进入
     * @param node
     */
    static in_nothing(node: cc.Node) {
        node.active = true
    }

    /** 
     * 直接离开
     * @param node
     */
    static out_nothing(node: cc.Node) {
        node.active = false
    }

    /**
     * 以scale形式进入;初始值为0,终点值为1
     * @param node 
     * @param params 
     */
    static in_scale(node: cc.Node, params: ParamsAction) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_IN
        return new Promise(res => {
            node.scale = 0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.scaleTo(params.time, 1).easing(params.ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以scale形式离开;初始值为当前值,终点值为0
     * @param node 
     * @param params
     */
    static out_scale(node: cc.Node, params: ParamsAction) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_OUT
        return new Promise(res => {
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.scaleTo(params.time, 0).easing(params.ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以fade形式进入;初始值为0,终点值为1
     * @param node 
     * @param params 
     */
    static in_fade(node: cc.Node, params: ParamsAction) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_IN
        return new Promise(res => {
            node.opacity = 0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.fadeIn(params.time).easing(params.ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以fade形式离开;初始值为当前值,终点值为0
     * @param node 
     * @param params 
     */
    static out_fade(node: cc.Node, params: ParamsAction) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_OUT
        return new Promise(res => {
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.fadeOut(params.time).easing(params.ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以move形式进入
     * @param node 
     * @param params 
     */
    static in_move(node: cc.Node, params: ParamsAction & {
        direction: TypeDirection,   // 方向;默认为left
        distance?: number           // 距离;默认会计算Math.max(cc.winSize.width, cc.winSize.height)
    }) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_IN
        params.direction = params.direction || "left"
        params.distance = params.distance || Math.max(cc.winSize.width, cc.winSize.height)
        return new Promise(res => {
            G.check_widget(node)
            let start_position = node.position.add(C.DIRECTION[params.direction].mul(params.distance))
            let end_postion = node.position
            node.position = start_position
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.moveTo(params.time, end_postion).easing(params.ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以move形式离开;初始值为当前位置,终点值根据direction和distance计算
     * @param node 
     * @param direction 
     * @param time 
     * @param ease 
     */
    static out_move(node: cc.Node, params: ParamsAction & {
        direction: TypeDirection,   // 方向;默认为left
        distance?: number           // 距离;默认会计算Math.max(cc.winSize.width, cc.winSize.height)
    }) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_OUT
        params.direction = params.direction || "left"
        params.distance = params.distance || Math.max(cc.winSize.width, cc.winSize.height)
        return new Promise(res => {
            let end_postion = node.position.add(C.DIRECTION[params.direction].mul(params.distance))
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.moveTo(params.time, end_postion).easing(params.ease),
                cc.callFunc(res),
            ))
        })
    }

    /**
     * 以fade+move的形式组合进入
     * @param node 
     * @param params 
     * @param params 
     */
    static in_fade_move(node: cc.Node, params: ParamsAction & {
        direction: TypeDirection    // 方向;默认为left
        distance?: number           // 距离;默认为100
        opacity?: number            // 透明度;默认为255
    }) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_IN
        params.direction = params.direction || "left"
        params.distance = params.distance || C.FADE_MOVE_DISTANCE
        params.opacity = params.opacity || 255
        return new Promise(res => {
            G.check_widget(node)
            let start_position = node.position.add(C.DIRECTION[params.direction].mul(params.distance))
            let end_position = node.position
            node.position = start_position
            node.opacity = 0
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.spawn(
                    cc.fadeTo(params.time, params.opacity).easing(params.ease),
                    cc.moveTo(params.time, end_position).easing(params.ease),
                ),
                cc.callFunc(res)
            ))
        })
    }

    /**
     * 以fade+move的形式组合离开
     * @param node 
     * @param params 
     * @param params 
     */
    static out_fade_move(node: cc.Node, params: ParamsAction & {
        direction: TypeDirection    // 方向;默认为left
        distance?: number           // 距离;默认为100
        opacity?: number            // 透明度;默认为0
    }) {
        params.delay = params.delay || 0
        params.time = params.time || C.TIME
        params.ease = params.ease || C.EASE_OUT
        params.direction = params.direction || "left"
        params.distance = params.distance || C.FADE_MOVE_DISTANCE
        params.opacity = params.opacity || 0
        return new Promise(res => {
            let end_position = node.position.add(C.DIRECTION[params.direction].mul(params.distance))
            node.active = true
            node.runAction(cc.sequence(
                cc.delayTime(params.delay),
                cc.spawn(
                    cc.moveTo(params.time, end_position).easing(params.ease),
                    cc.fadeOut(params.time).easing(params.ease),
                ),
                cc.callFunc(res)
            ))
        })
    }

}
