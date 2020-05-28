/**
 * 状态表
 * - key 为状态名称
 * - value 状态内容
 */
export class StateTable<TKey extends string, TValue> {
  constructor(source: { [K in TKey]: TValue }) {
    this.source = new Map(Object.entries(source)) as any;
  }

  /** 存储 */
  private source: Map<TKey, TValue>;

  /**
   * 判断是否包含某个状态
   * @param key
   */
  has(key: TKey): boolean {
    return this.source.has(key);
  }

  /**
   * 获取某个状态的值
   * @param key
   */
  get(key: TKey): TValue {
    return this.source.get(key);
  }

  /** 获取全部状态 */
  get_all() {
    return this.source;
  }

  /**
   * 新增某个状态
   * @param key
   * @param value
   */
  add(key: TKey, value?: any) {
    this.source.set(key, value);
  }

  /**
   * 删除某个状态
   * @param key
   * @param value
   */
  del(key: TKey, value?: any) {
    this.source.delete(key);
  }

  /** 获取所有的key */
  get_keys(): string[] {
    return [...this.source.keys()];
  }
}
