/**
 * 锁定状态
 */
declare enum LockState {
    /** 锁定中 */
    Lock = 0,
    /** 未锁定 */
    Unlock = 1
}
/**
 * 简单有限状态机：simple finite state machine
 * - 使用string类型作为state的标记
 * - 在执行事件过渡动作时，整个状态机处于锁定状态
 * @since 1.0.0
 * @see https://www.yuque.com/fengyong/game-develop-road/lrggbd
 */
export declare class StateMachine<TState extends string> {
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
    /**
     * 重置状态机
     * @since 1.0.0
     * @param state
     */
    _reset(state: TState): void;
    /**
     * 锁定状态机
     * @since 1.0.0
     */
    lock(): void;
    /**
     * 解锁状态机
     * @since 1.0.0
     */
    unlock(): void;
    /**
     * 是否处于某个状态中
     * @since 1.0.0
     * @param states
     */
    is_state(...states: TState[]): boolean;
    /**
     * is_state的lock版本
     * @since 1.0.0
     */
    is_state_lock(...states: TState[]): boolean;
    /**
     * 是否可以去到下个状态
     * @since 1.0.0
     * @param state
     * @param lock_state
     */
    can_go_state(state: TState, lock_state?: keyof typeof LockState): boolean;
    /**
     * 尝试进入下个状态
     * @since 1.0.0
     * @param state
     * @param lock_state
     */
    try_go_state(state: TState, lock_state?: keyof typeof LockState): boolean;
}
export {};
