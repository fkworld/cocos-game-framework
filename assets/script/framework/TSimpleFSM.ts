import { FLog } from "./FLog";

/**
 * [T] simple finite state machine - 简单的状态机
 * - 一个适合游戏中使用的简单状态机实现
 * - 只有状态和行为，触发由change_state()方法触发
 */
export class TSimpleFSM {

    /**
     * 创建并返回一个简单状态机
     * @param map 状态-行为一一对应的map
     */
    static create(map: Map<string, () => void>): TSimpleFSM {
        let fsm = new TSimpleFSM()
        fsm.map_state = map
        return fsm
    }

    /** 当前状态 */
    private state: string;

    /** 状态以及其对应的处理函数 */
    private map_state: Map<string, () => void> = new Map()

    /**
     * 更改当前状态
     * @param new_state 
     */
    change_state(new_state: string) {
        if (!this.map_state.has(new_state)) {
            FLog.error(`@TSimpleFSM: 获取了一个不存在的状态, state=${new_state}`)
            return
        }
        this.state = new_state
        this.map_state.get(this.state)()
    }

}