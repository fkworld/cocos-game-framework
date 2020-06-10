/**
 * 原生模块
 * - js与java间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html?h=java
 * - js与OC间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/oc-reflection.html
 */

import { event_center } from "./event";
import { log, LogLevel } from "./log";

/** 入口封装类 */
const GATE_CLASS = "JSBinding";
/** android 平台的单独配置 */
const ANDROID_CONFIG = {
  /** 类位置 */
  CLASS_PATH: "org/cocos2dx/javascript/",
  /** 方法签名 */
  METHOD_SIGNATURE: "(Ljava/lang/String;)Ljava/lang/String;",
};
/** 事件：原生回调游戏 */
const EVENT_NATIVE_CALLBACK = "@event:native/native-callback";

/** 原生给的回调结果，由回调id和回调结果组成 */
let native_callbacks: Map<string, string> = new Map();

/** 判断为android平台 */
export function is_android() {
  return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID;
}

/** 判断为ios平台 */
export function is_ios() {
  return cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS;
}

/** 判断为原生平台 */
export function is_native() {
  return cc.sys.isNative;
}

/**
 * 调用原生
 * @param method 方法名
 * @param params 入参；如果是json字符串，请在外部手动传入
 */
export function call(method: string, params = {}): string {
  let params_json = JSON.stringify(params);
  if (is_ios()) {
    log(LogLevel.DEV, method, params_json);
    return jsb.reflection.callStaticMethod(GATE_CLASS, method + ":", params_json);
  } else if (is_android()) {
    log(LogLevel.DEV, method, params_json);
    return jsb.reflection.callStaticMethod(
      ANDROID_CONFIG.CLASS_PATH + GATE_CLASS,
      method,
      ANDROID_CONFIG.METHOD_SIGNATURE,
      params_json,
    );
  } else {
    // 非原生平台
    return;
  }
}

/**
 * 异步调用
 * - TODO：添加wait_time的作用
 * @param method 方法名
 * @param params 入参
 * @param wait_time 最大等待时间，默认为100s
 */
export async function call_async(method: string, params = {}, wait_time = 100): Promise<string> {
  // 拼接回调id：方法名+当前时间+随机数
  let call_id = `${method}/${Date.now().toString(36)}/${Math.random().toFixed(5)}`;
  // 通知原生
  call(method, Object.assign(params, { call_id }));
  // 监听回调
  return new Promise(res => {
    let t = {};
    event_center.on(
      EVENT_NATIVE_CALLBACK,
      () => {
        if (native_callbacks.has(call_id)) {
          res(native_callbacks.get(call_id));
          event_center.targetOff(t);
          native_callbacks.delete(call_id);
        }
      },
      t,
    );
  });
}

/**
 * 原生调js的全局方法
 * @param call_id 调用id
 * @param call_result 调用结果
 */
window["NativeCallback"] = (call_id: string, call_result: string) => {
  log(LogLevel.DEV, "NativeCallback", call_id, call_result);
  native_callbacks.set(call_id, call_result);
  event_center.emit(EVENT_NATIVE_CALLBACK);
};
