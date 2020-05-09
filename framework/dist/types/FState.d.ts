/**
 * 状态管理模块
 * - 状态表：使用key-value形式存储
 * - 简单状态机：简单状态跳转，带锁定机制
 * - 简单节点状态动画
 */
export declare namespace FState {
    /**
     * 状态表
     */
    class StateTable<TKey extends string, TValue> {
        constructor(source: {
            [K in TKey]: TValue;
        });
        /** 存储 */
        private source;
        /**
         * 判断是否包含某个状态
         * @param key
         */
        has(key: TKey): boolean;
        /**
         * 获取某个状态的值
         * @param key
         */
        get(key: TKey): TValue;
        /**
         * 获取全部状态
         */
        get_all(): Map<TKey, TValue>;
        /**
         * 新增某个状态
         * @param key
         * @param value
         */
        add(key: TKey, value?: any): void;
        /**
         * 删除某个状态
         * @param key
         * @param value
         */
        del(key: TKey, value?: any): void;
        /** 输出所有的状态key */
        log_keys(): string;
    }
    /**
     * 简单有限状态机：simple finite state machine
     * - 【string标记】使用string作为状态（state）的标记
     * - 【锁定机制】在执行事件过渡动作时，整个状态机处于锁定状态
     */
    class SFSM<TState extends string> {
        constructor(config: {
            id: string;
            initial: TState;
            states: {
                [key in TState]: TState[];
            };
        });
        private readonly id;
        private state;
        private states;
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
        /** try_go_state的lock版本 */
        try_go_state_with_lock(state: TState): boolean;
    }
    /**
     * 简单节点动画
     */
    abstract class SimpleNodeAnima {
        /** 保存在node上的key */
        private static readonly SAVE_KEY;
        /**
         * 设置节点的状态信息
         * @param node
         * @param state
         */
        private static set_all;
        /**
         * 无动画，直接至某个节点为某个状态
         * @param node
         * @param to
         */
        static no_anima(node: cc.Node, to: string): void;
        /**
         * 动画：从目前状态通过动画迁移到目标状态
         * @param node
         * @param to 目标状态的key
         * @param params 动画参数
         */
        static anima(node: cc.Node, to: string, params: {
            time?: number;
            delay?: number;
            ease?: cc.tweenEasing;
        }): Promise<void>;
    }
}
