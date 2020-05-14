// 原生模块
// js与java间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html?h=java
// js与OC间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/oc-reflection.html

import { event_center, on_success_once_event } from "./event";
import { TAG, do_delay } from "./tool";

/** 入口封装类 */
const GATE_CLASS = "JSBinding";
/** 原生调用游戏的全局方法 */
const NATIVE_CALLBACK = "NativeCallback";
/** android 平台的单独配置 */
const ANDROID_CONFIG = {
  /** 类位置 */
  CLASS_PATH: "org/cocos2dx/javascript/",
  /** 方法签名 */
  FUNC_SIGNATURE: "(Ljava/lang/String;)Ljava/lang/String;",
};
/** 事件：原生回调游戏 */
const EVENT_NATIVE_CALLBACK = "@event:native/native-callback";

/** 原生给的回调结果，由回调 id 和回调结果组成 */
let native_callbacks: Map<string, string> = new Map();

/** 判断为 android 平台 */
export const is_android = () => cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID;

/** 判断为 ios 平台 */
export const is_ios = () => cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS;

/** 判断为原生平台 */
export const is_native = () => cc.sys.isNative;

/**
 * 调用原生
 * @param method 方法名
 * @param params 入参
 */
export const call = (method: string, params: string): string => {
  if (is_ios()) {
    cc.log(TAG, method, params);
    return jsb.reflection.callStaticMethod(GATE_CLASS, method + ":", params);
  } else if (is_android()) {
    cc.log(TAG, method, params);
    return jsb.reflection.callStaticMethod(
      ANDROID_CONFIG.CLASS_PATH + GATE_CLASS,
      method,
      ANDROID_CONFIG.FUNC_SIGNATURE,
      params
    );
  } else {
    // 非原生平台，返回 null
    return null;
  }
};

/**
 * 异步调用
 * - TODO：添加 wait_time 的作用
 * @param method 方法名
 * @param params 入参
 * @param wait_time 最大等待时间，默认为100s
 */
export const call_async = async (method: string, params: {}, wait_time = 100): Promise<string> => {
  // 拼接回调 id：方法名+当前时间+随机数
  let call_id = `${method}/${Date.now().toString(36)}/${Math.random().toFixed(5)}`;
  // 拼接入参
  let params_with_call_id = Object.assign(params, { call_id: call_id });
  // 通知原生
  call(method, JSON.stringify(params_with_call_id));
  // 监听回调
  return new Promise(res => {
    on_success_once_event(
      EVENT_NATIVE_CALLBACK,
      () => {
        return native_callbacks.has(call_id);
      },
      () => {
        let result = native_callbacks.get(call_id);
        native_callbacks.delete(call_id);
        res(result);
      }
    );
  });
};

/**
 * 原生调 js 的全局方法
 * @param call_id 调用id
 * @param call_result 调用结果
 */
window[NATIVE_CALLBACK] = (call_id: string, call_result: string) => {
  console.log(TAG, NATIVE_CALLBACK, call_id, call_result);
  native_callbacks.set(call_id, call_result);
  event_center.emit(EVENT_NATIVE_CALLBACK);
};
