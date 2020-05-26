/**
 * 简单有限状态机：simple finite state machine
 * - 使用string类型作为state的标记
 * - 在执行事件过渡动作时，整个状态机处于锁定状态
 */
export class SimpleFSM<TState extends string> {
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

  /** 锁定状态机 */
  lock() {
    this.is_lock = true;
  }

  /** 解锁状态机 */
  unlock() {
    this.is_lock = false;
  }

  /** 是否处于某个状态中 */
  is_state(...states: TState[]) {
    return states.includes(this.state);
  }

  /** is_state的lock版本 */
  is_state_with_lock(...states: TState[]) {
    return this.is_state(...states) && !this.is_lock;
  }

  /** 是否可以去到下个状态 */
  can_go_state(state: TState) {
    return this.states[this.state].includes(state);
  }

  /** can_go_state的lock版本 */
  can_go_state_with_lock(state: TState) {
    return this.can_go_state(state) && !this.is_lock;
  }

  /** 尝试去到下个状态 */
  try_go_state(state: TState) {
    if (this.can_go_state(state)) {
      this.state = state;
      return true;
    } else {
      return false;
    }
  }

  /** try_go_state的lock 版本 */
  try_go_state_with_lock(state: TState) {
    if (this.can_go_state_with_lock(state)) {
      this.state = state;
      return true;
    } else {
      return false;
    }
  }
}
