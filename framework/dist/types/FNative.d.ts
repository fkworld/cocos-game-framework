/**
 * 原生模块，封装与原生之间的相互调用
 * - js与java间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html?h=java
 * - js与OC间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/oc-reflection.html
 * - 【特别注意】使用一个入口类封装所有交互函数，并且对android而言，交互函数的入参和出参均为string，必要时使用json封装
 * - 【特别注意】实现一个简单的异步交互机制，方便ts代码的调用
 */
export declare namespace FNative {
    /** 判断为android平台 */
    const is_android: () => boolean;
    /** 判断为ios平台 */
    const is_ios: () => boolean;
    /** 判断为原生平台 */
    const is_native: () => boolean;
    /**
     * 调用原生
     * @param method 方法名
     * @param params 入参
     */
    const call: (method: string, params: string) => string;
    /**
     * 异步调用
     * @param method 方法名
     * @param params 入参
     * @param wait_time 最大等待时间，默认为100s
     */
    const call_async: (method: string, params: {}, wait_time?: number) => Promise<string>;
}
