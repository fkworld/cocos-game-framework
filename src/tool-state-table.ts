/**
 * 状态表
 * @since 1.0.0
 * @see https://www.yuque.com/fengyong/game-develop-road/uirtec
 */
export class StateTable<TKey extends string, TValue> {
  constructor(source: { [K in TKey]: TValue }) {
    this.source = new Map(Object.entries(source)) as any;
  }

  /** 存储结构 */
  private readonly source: Map<TKey, TValue>;

  /**
   * 判断是否包含某个状态
   * @since 1.0.0
   * @param key
   */
  has(key: TKey): boolean {
    return this.source.has(key);
  }

  /**
   * 获取某个状态的值
   * @since 1.0.0
   * @param key
   */
  get(key: TKey): TValue {
    return this.source.get(key);
  }

  /**
   * 新增某个状态，一般不要使用
   * @since 1.0.0
   * @param key
   * @param value
   */
  _add(key: TKey, value?: TValue): void {
    this.source.set(key, value);
  }

  /**
   * 删除某个状态，一般不要使用
   * @since 1.0.0
   * @param key
   */
  _del(key: TKey): void {
    this.source.delete(key);
  }
}
