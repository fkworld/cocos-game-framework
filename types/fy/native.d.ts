/** 判断为android平台 */
export declare const is_android: () => boolean;
/** 判断为ios平台 */
export declare const is_ios: () => boolean;
/** 判断为原生平台 */
export declare const is_native: () => boolean;
/**
 * 调用原生
 * @param method 方法名
 * @param params 入参
 */
export declare const call: (method: string, params: string) => string;
/**
 * 异步调用
 * @param method 方法名
 * @param params 入参
 * @param wait_time 最大等待时间，默认为100s
 */
export declare const call_async: (method: string, params: {}, wait_time?: number) => Promise<string>;
