/**
 * 状态管理
 * - 状态表：使用 key-value 形式管理状态，用于根据 key 来获取状态的 value。参考 TNodeState。
 * - 状态跳转表：使用单个 key 管理状态，用于判定当前状态是否可以跳转到下一个状态。参考 Gameplay。
 * - 状态集合：使用单个 key 管理状态，用于判定当前是否包含某个状态标记。参考 FVersion。
 */
export namespace FState {

    /** 状态表 */
    export class StateTable<TKey extends string, TValue> {

        private state_source: Map<TKey, TValue> = new Map()
        constructor(source: { [K in TKey]: TValue }) {
            this.state_source = new Map(Object.entries(source)) as Map<TKey, TValue>
        }

        /** 是否包含某个状态 */
        has_state(key: TKey): boolean {
            return this.state_source.has(key)
        }

        /** 获取某个状态的值 */
        get_state(key: TKey): TValue {
            return this.state_source.get(key)
        }
    }

    /** 状态跳转表 */
    export class StateJumpTable<TKey extends string> {

        private state_source: Map<TKey, TKey[]>
        private state_now: TKey
        constructor(source: { [K in TKey]: TKey[] }, state_now: TKey) {
            this.state_source = new Map(Object.entries(source)) as Map<TKey, TKey[]>
            this.state_now = state_now
        }

        /** 是否处于给定的状态 */
        check_state(...state_list: TKey[]): boolean {
            return state_list.includes(this.state_now)
        }

        /** 尝试更改状态 */
        try_change_state(next_state: TKey): boolean {
            if (this.state_source.get(this.state_now).includes(next_state)) {
                this.state_now = next_state
                return true
            } else {
                return false
            }
        }
    }

    /** 状态集合 */
    export class StateSet<TKey extends string> {

        private state_now: Set<TKey> = new Set()
        constructor(...source: TKey[]) {
            this.state_now = new Set(source)
        }

        /** 是否拥有某个状态 */
        public has_state(state: TKey): boolean {
            return this.state_now.has(state)
        }

        public to_string() {
            return [...this.state_now].toString()
        }
    }
}
