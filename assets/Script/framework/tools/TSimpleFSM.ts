/**
 * [framework-T] simple finite state machine - 简单的状态机实现
 * - 一个适合游戏中使用的简单状态机实现
 * - 只有状态和行为，触发由change_state()方法触发
 */
export class TSimpleFSM {

    obj_state: object

    constructor(obj_state: object) {
        // check，只检查并报错，cc.error()，不进行额外处理
        for (let s in obj_state) {
            if (typeof obj_state[s] != 'function') {
                cc.error(`get a not-function value, state=${s}`)
                // return
            }
        }
        // save
        this.obj_state = obj_state
    }

    /** 当前状态 */
    state: string

    /**
     * 更改当前状态
     * @param new_state 
     */
    change_state(new_state: string) {
        this.state = new_state
        let f = this.obj_state[new_state]
        if (typeof f === 'function') {
            f()
        } else {
            cc.error(`get a not-function value, state=${new_state}`)
        }
    }
}