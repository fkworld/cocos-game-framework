import { FTool } from "./FTool"

/**
 * 原生模块，封装与原生之间的相互调用
 * - js与java间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html?h=java
 * - js与OC间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/oc-reflection.html
 * - 【特别注意】使用一个入口类封装所有交互函数，并且对android而言，交互函数的入参和出参均为string，必要时使用json封装
 * - 【特别注意】实现一个简单的异步交互机制，方便ts代码的调用
 */
export namespace FNative {

    /** 输出log */
    const TAG = "@FNative:"
    /** 入口封装类 */
    const GATE_CLASS = "JSBinding"
    /** 原生调用游戏的全局方法 */
    const NATIVE_CALLBACK = "NativeCallback"
    /** android平台的单独配置 */
    const ANDROID_CONFIG = {
        /** 类位置 */
        CLASS_PATH: "org/cocos2dx/javascript/",
        /** 方法签名 */
        FUNC_SIGNATURE: "(Ljava/lang/String;)Ljava/lang/String;"
    }
    /** 原生给的回调结果，由回调id和回调结果组成 */
    let native_callbacks: Map<string, string> = new Map()

    /** 判断为android平台 */
    export function is_android() {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID
    }

    /** 判断为ios平台 */
    export function is_ios() {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS
    }

    /** 判断为原生平台 */
    export function is_native() {
        return cc.sys.isNative
    }

    /**
     * 调用原生
     * @param method 方法名
     * @param params 入参
     */
    export function call(method: string, params: string): string {
        console.log(TAG, method, params)
        if (is_ios()) {
            return jsb.reflection.callStaticMethod(GATE_CLASS, method + ":", params)
        } else if (is_android()) {
            return jsb.reflection.callStaticMethod(
                ANDROID_CONFIG.CLASS_PATH + GATE_CLASS,
                method,
                ANDROID_CONFIG.FUNC_SIGNATURE,
                params)
        } else {
            // 非原生平台，返回null
            return null
        }
    }

    /**
     * 异步调用
     * @param method 方法名
     * @param params 入参
     * @param wait_time 最大等待时间，默认为100s
     */
    export async function call_async(method: string, params: {}, wait_time = 100): Promise<string> {
        // 拼接回调id：方法名+当前时间+随机数
        let call_id = `${method}/${Date.now().toString(36)}/${Math.random().toFixed(5)}`
        // 拼接入参
        let params_with_call_id = Object.assign(params, { call_id: call_id })
        // 通知原生
        call(method, JSON.stringify(params_with_call_id))
        // 每0.1s轮训，查看是否有原生的回调
        let time = 0
        while (time < wait_time) {
            time += 0.1
            if (native_callbacks.has(call_id)) {
                let result = native_callbacks.get(call_id)
                native_callbacks.delete(call_id)
                return result
            } else {
                await FTool.wait_time(0.1)
            }
        }
        // 超过时间轮训不到，则返回null
        return null
    }

    /**
     * 原生调js的全局方法
     * @param call_id 调用id
     * @param call_result 调用结果
     */
    window[NATIVE_CALLBACK] = (call_id: string, call_result: string) => {
        console.log(TAG, NATIVE_CALLBACK, call_id, call_result)
        native_callbacks.set(call_id, call_result)
    }

}
