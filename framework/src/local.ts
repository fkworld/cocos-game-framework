// 本地存储模块

import { TAG } from "./tool";
import { version_center } from "./version";

/**
 * 本地存储配置
 * - key 表示存储在本地的 key
 * - value 表示默认值，可以为 string | boolean | number，但是在获取时只会获取到 string
 */
export interface ConfigLocal {
  /** 语言 */
  language: string;
  /** 音乐开关 */
  music: true;
  /** 音效开关 */
  sound: true;
  [k: string]: string | boolean | number;
}

/** 缓存 */
let locals: Map<string, string>;

/** 默认值 */
let locals_default: ConfigLocal;

/**
 * 在运行时初始化
 * @param config
 */
export const _init_local_runtime = (config: ConfigLocal) => {
  locals = new Map();
  locals_default = config;
  version_center.has("resetLocal") && cc.sys.localStorage.clear();
  cc.log(TAG, "初始化local模块成功，local_config=", config);
};

/**
 * 获取本地存储值
 * - 返回值会转化为 string 或 null
 * - 顺序依次为：缓存，本地存储，配置的默认值
 * @param key
 */
export const get_local = (key: string): string => {
  let value = locals.get(key) ?? cc.sys.localStorage.getItem(key) ?? `${locals_default[key]}`;
  locals.set(key, value);
  return value;
};

/**
 * 修改本地存储
 * @param key
 * @param value
 */
export const set_local = (key: string, value: string) => {
  locals.set(key, value);
  Promise.resolve().then(() => {
    cc.sys.localStorage.setItem(key, value);
  });
};
