/**
 * 状态表
 * @since 1.0.0
 * @see https://www.yuque.com/fengyong/game-develop-road/uirtec
 */
export declare class StateTable<TKey extends string, TValue> {
    constructor(source: {
        [K in TKey]: TValue;
    });
    /** 存储结构 */
    private readonly source;
    /**
     * 判断是否包含某个状态
     * @since 1.0.0
     * @param key
     */
    has(key: TKey): boolean;
    /**
     * 获取某个状态的值
     * @since 1.0.0
     * @param key
     */
    get(key: TKey): TValue;
    /**
     * 新增某个状态，一般不要使用
     * @since 1.0.0
     * @param key
     * @param value
     */
    _add(key: TKey, value?: TValue): void;
    /**
     * 删除某个状态，一般不要使用
     * @since 1.0.0
     * @param key
     */
    _del(key: TKey): void;
}
