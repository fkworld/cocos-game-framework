/**
 * 锁定状态
 */
enum LockState {
  /** 锁定中 */
  Lock,
  /** 未锁定 */
  Unlock,
}

/**
 * 简单有限状态机：simple finite state machine
 * - 使用string类型作为state的标记
 * - 在执行事件过渡动作时，整个状态机处于锁定状态
 * @since 1.0.0
 * @see https://www.yuque.com/fengyong/game-develop-road/lrggbd
 */
export class StateMachine<TState extends string> {
  /**
   * 初始化状态机
   * @param states 状态描述，value值为其可跳转的状态
   * @param initial
   */
  constructor(initial: TState, states: { [key in TState]: TState[] }) {
    this.state = initial;
    this.states = states;
    this.is_lock = false;
  }

  /** 当前状态 */
  private state: TState;
  /** 状态描述 */
  private states: { [key in TState]: TState[] };
  /** 是否为锁定状态 */
  private is_lock: boolean;

  /**
   * 重置状态机
   * @since 1.0.0
   * @param state
   */
  _reset(state: TState): void {
    this.state = state;
    this.is_lock = false;
  }

  /**
   * 锁定状态机
   * @since 1.0.0
   */
  lock(): void {
    this.is_lock = true;
  }

  /**
   * 解锁状态机
   * @since 1.0.0
   */
  unlock(): void {
    this.is_lock = false;
  }

  /**
   * 是否处于某个状态中
   * @since 1.0.0
   * @param states
   */
  is_state(...states: TState[]): boolean {
    return states.includes(this.state);
  }

  /**
   * is_state的lock版本
   * @since 1.0.0
   */
  is_state_lock(...states: TState[]): boolean {
    return this.is_state(...states) && !this.is_lock;
  }

  /**
   * 是否可以去到下个状态
   * @since 1.0.0
   * @param state
   * @param lock_state
   */
  can_go_state(state: TState, lock_state: keyof typeof LockState = "Unlock"): boolean {
    let f = this.states[this.state].includes(state);
    return lock_state === "Lock" ? f && !this.is_lock : f;
  }

  /**
   * 尝试进入下个状态
   * @since 1.0.0
   * @param state
   * @param lock_state
   */
  try_go_state(state: TState, lock_state: keyof typeof LockState = "Unlock"): boolean {
    if (this.can_go_state(state, lock_state)) {
      this.state = state;
      return true;
    } else {
      return false;
    }
  }
}
