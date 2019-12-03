/**
 * 状态管理
 * - 状态表：使用 key-value 形式管理状态，用于根据 key 来获取状态的 value。参考 TNodeState。
 * - 状态跳转表：使用单个 key 管理状态，用于判定当前状态是否可以跳转到下一个状态。参考 Gameplay。
 * - 状态集合：使用单个 key 管理状态，用于判定当前是否包含某个状态标记。参考 FVersion。
 */
export namespace FState {

    /** 状态表，构造时传入状态key和状态内容 */
    export class StateTable<TKey extends string, TValue> {

        constructor(source: { [K in TKey]: TValue }) {
            Object.keys(source).forEach(key => {
                this.state_source.set(<TKey>key, source[key])
            })
        }

        /** 状态数据 */
        private state_source: Map<TKey, TValue> = new Map()

        /** 是否包含某个状态 */
        has_state(key: TKey): boolean {
            return this.state_source.has(key)
        }

        /** 获取某个状态的值 */
        get_state(key: TKey): TValue {
            return this.state_source.get(key)
        }
    }

    /** 状态跳转表，构造时传入状态key下的可跳转集合，以及当前状态 */
    export class StateJumpTable<TKey extends string> {

        constructor(state_now: TKey, source: { [K in TKey]: TKey[] }) {
            this.state_now = state_now
            // 设置next
            Object.keys(source).forEach(key => {
                this.state_source.set(<TKey>key, { pre: [], next: source[key] })
            })
            // 设置pre
            this.state_source.forEach((v, k) => {
                v.next.forEach(next => {
                    this.state_source.get(next).pre.push(k)
                })
            })
        }

        /** 状态数据 */
        private state_source: Map<TKey, { pre: TKey[], next: TKey[] }> = new Map()

        /** 当前状态 */
        private state_now: TKey

        check_state(...state_list: TKey[]): boolean {
            return state_list.includes(this.state_now)
        }

        try_change_state(next_state: TKey): boolean {
            if (this.state_source.get(this.state_now).next.includes(next_state)) {
                this.state_now = next_state
                return true
            } else {
                return false
            }
        }
    }

    /** 状态集合，构造时传入当前状态集合 */
    export class StateSet<TKey> {

        constructor(...state_list: TKey[]) {
            this.state_now = new Set(state_list)
        }

        private state_now: Set<TKey> = new Set()

        public has_state(state: TKey): boolean {
            return this.state_now.has(state)
        }

        public change_state(...state_list: TKey[]) {
            this.state_now = new Set(state_list)
        }
    }
}
