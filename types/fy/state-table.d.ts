/**
 * 状态表
 */
export declare class StateTable<TKey extends string, TValue> {
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
