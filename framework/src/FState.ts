/**
 * 状态管理模块
 * - 状态表：使用key-value形式存储
 * - 简单状态机：简单状态跳转，带锁定机制
 * - 简单节点状态动画
 */
export namespace FState {

    /**
     * 状态表
     */
    export class StateTable<TKey extends string, TValue> {

        constructor(source: { [K in TKey]: TValue }) {
            this.source = new Map(Object.entries(source)) as any
        }

        /** 存储 */
        private source: Map<TKey, TValue> = new Map()

        /**
         * 判断是否包含某个状态
         * @param key
         */
        has(key: TKey): boolean {
            return this.source.has(key)
        }

        /**
         * 获取某个状态的值
         * @param key
         */
        get(key: TKey): TValue {
            return this.source.get(key)
        }

        /**
         * 获取全部状态
         */
        get_all() {
            return this.source
        }

        /**
         * 新增某个状态
         * @param key
         * @param value
         */
        add(key: TKey, value = null) {
            this.source.set(key, value)
        }

        /**
         * 删除某个状态
         * @param key
         * @param value
         */
        del(key: TKey, value = null) {
            this.source.delete(key)
        }

        /** 输出所有的状态key */
        log_keys(): string {
            return `${this.source.keys()}`
        }
    }

    /**
     * 简单有限状态机：simple finite state machine
     * - 【string标记】使用string作为状态（state）的标记
     * - 【锁定机制】在执行事件过渡动作时，整个状态机处于锁定状态
     */
    export class SFSM<TState extends string> {

        constructor(config: {
            id: string                              // 标记
            initial: TState,                        // 初始状态
            states: { [key in TState]: TState[] },  // 状态跳转表
        }) {
            this.id = config.id
            this.state = config.initial
            this.states = config.states
            this.is_lock = false
        }

        private readonly id: string
        private state: TState
        private states: ConstructorParameters<typeof SFSM>[0]["states"]
        private is_lock: boolean

        /** 锁定状态机 */
        lock() {
            this.is_lock = true
        }

        /** 解锁状态机 */
        unlock() {
            this.is_lock = false
        }

        /** 是否处于某个状态中 */
        is_state(...states: TState[]) {
            return states.includes(this.state)
        }

        /** is_state的lock版本 */
        is_state_with_lock(...states: TState[]) {
            return this.is_state(...states) && !this.is_lock
        }

        /** 是否可以去到下个状态 */
        can_go_state(state: TState) {
            return this.states[this.state].includes(state)
        }

        /** can_go_state的lock版本 */
        can_go_state_with_lock(state: TState) {
            return this.can_go_state(state) && !this.is_lock
        }

        /** 尝试去到下个状态 */
        try_go_state(state: TState) {
            if (this.can_go_state(state)) {
                this.state = state
                return true
            } else {
                return false
            }
        }

        /** try_go_state的lock版本 */
        try_go_state_with_lock(state: TState) {
            if (this.can_go_state_with_lock(state)) {
                this.state = state
                return true
            } else {
                return false
            }
        }
    }

    /**
     * 简单节点动画
     */
    export abstract class SimpleNodeAnima {

        /** 保存在node上的key */
        private static readonly SAVE_KEY = Symbol()

        /**
         * 设置节点的状态信息
         * @param node
         * @param state
         */
        private static set_all(node: cc.Node, states: { [key: string]: Partial<cc.Node> }, init_state?: string) {
            node[SimpleNodeAnima.SAVE_KEY] = states
            init_state && this.no_anima(node, init_state)
        }

        /**
         * 无动画，直接至某个节点为某个状态
         * @param node
         * @param to
         */
        static no_anima(node: cc.Node, to: string) {
            cc.tween(node)
                .set(node[SimpleNodeAnima.SAVE_KEY][to])
                .start()
        }

        /**
         * 动画：从目前状态通过动画迁移到目标状态
         * @param node
         * @param to 目标状态的key
         * @param params 动画参数
         */
        static async anima(node: cc.Node, to: string, params: {
            time?: number;          // 时间，默认为0.3
            delay?: number;         // 延迟，默认为0
            ease?: cc.tweenEasing;  // ease函数，默认为linear
        }) {
            if (params.time === undefined) { params.time = 0.3 }
            if (params.delay === undefined) { params.delay = 0 }
            if (params.ease === undefined) { params.ease = "linear" }
            await new Promise(res => {
                cc.tween(node)
                    .delay(params.delay)
                    .to(params.time, node[SimpleNodeAnima.SAVE_KEY][to], { easing: params.ease })
                    .call(res)
                    .start()
            })
        }
    }
}
