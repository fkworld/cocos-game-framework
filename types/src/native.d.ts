/**
 * 原生交互模块
 * @see https://www.yuque.com/fengyong/game-develop-road/bd0icr
 * @see js与java间的互相调用 http://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html?h=java
 * @see js与OC间的互相调用 http://docs.cocos.com/creator/manual/zh/advanced-topics/oc-reflection.html
 */
/**
 * 判断为android平台
 * @since 1.0.0
 */
export declare function is_android(): boolean;
/**
 * 判断为ios平台
 * @since 1.0.0
 */
export declare function is_ios(): boolean;
/**
 * 判断为原生平台
 * @since 1.0.0
 */
export declare function is_native(): boolean;
/**
 * 调用原生
 * @since 1.0.0
 * @param method 方法名
 * @param params 入参。如果是json字符串，请在外部手动传入
 */
export declare function call(method: string, params?: {}): string;
/**
 * 异步调用原生
 * @since 1.0.0
 * @param method 方法名
 * @param params 入参
 * @param _wait_time 最大等待时间，默认为100s
 * @todo 添加最大等待时间的作用
 */
export declare function call_async(method: string, params?: {}, _wait_time?: number): Promise<string>;
