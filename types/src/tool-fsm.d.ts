/**
 * 简单有限状态机：simple finite state machine
 * - 使用string类型作为state的标记
 * - 在执行事件过渡动作时，整个状态机处于锁定状态
 */
export declare class SimpleFSM<TState extends string> {
    /**
     * 初始化状态机
     * @param states 状态描述，value值为其可跳转的状态
     * @param initial
     */
    constructor(initial: TState, states: {
        [key in TState]: TState[];
    });
    /** 当前状态 */
    private state;
    /** 状态描述 */
    private states;
    /** 是否为锁定状态 */
    private is_lock;
    /** 锁定状态机 */
    lock(): void;
    /** 解锁状态机 */
    unlock(): void;
    /** 是否处于某个状态中 */
    is_state(...states: TState[]): boolean;
    /** is_state的lock版本 */
    is_state_with_lock(...states: TState[]): boolean;
    /** 是否可以去到下个状态 */
    can_go_state(state: TState): boolean;
    /** can_go_state的lock版本 */
    can_go_state_with_lock(state: TState): boolean;
    /** 尝试去到下个状态 */
    try_go_state(state: TState): boolean;
    /** try_go_state的lock 版本 */
    try_go_state_with_lock(state: TState): boolean;
}
