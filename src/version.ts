/**
 * 版本管理模块
 * - 需要初始化，传入版本标记信息
 * @see https://www.yuque.com/fengyong/game-develop-road/ylcktc
 * @see https://www.yuque.com/fengyong/game-develop-road/fq9a6f
 */

/**
 * 版本标记信息
 * @property key 表示版本标记
 * @property value 表示是否包含此标记，1表示包含，0表示不包含
 */
export interface ConfigVersion {
  [k: string]: number;
}

/**
 * 版本额外信息
 */
export interface ConfigVersionInfo {
  /** 项目名称 */
  name?: string;
  /** 项目作者 */
  author?: string;
  /** 项目版本，例如：1.0.0/2020.5.11 */
  version?: string;
  /** ios项目打包版本，例如：1.0.0/2020051101/2020.5.11 */
  ios_version?: string;
  /** android项目打包版本，例如：1.0.0/2020051102/2020.5.11 */
  android_version?: string;
}

/** 版本标记 */
let versions: Set<string>;

/**
 * 初始化版本信息
 * @param config 版本标记信息
 * @since 1.0.0
 */
export function _init_version(config: ConfigVersion = { reset_local: 1 }): void {
  versions = new Set(
    Object.keys(config).filter(key => {
      return !!config[key];
    }),
  );
}

/**
 * 是否包含某个版本标记
 * @since 1.0.0
 * @param version_key
 */
export function has_version(version_key: string): boolean {
  return versions.has(version_key);
}

/**
 * 新增一个版本标记，一般情况下不要使用
 * @since 1.0.0
 * @param version_key
 */
export function _add_version(version_key: string): void {
  versions.add(version_key);
}

/**
 * 删除一个版本标记，一般情况下不要使用
 * @since 1.0.0
 * @param version_key
 */
export function _del_version(version_key: string): void {
  versions.delete(version_key);
}

/**
 * dev模式下全局变量装饰器，针对类
 * @since 1.0.0
 * @example
 * &#64;DE_DEV_CONSOLE
 * export class A {}
 */
export function DE_DEV_CONSOLE(constructor: new () => unknown): void {
  CC_DEV && (window[constructor.name] = constructor);
}

/**
 * dev模式下全局变量装饰器，针对模块
 * - 实际上并非作为装饰器的用法
 * @since 1.0.0
 * @example
 * export namespace A {
 * DE_DEV_CONSOLE_NAMESPACE("A", A);
 * }
 */
export function DE_DEV_CONSOLE_NAMESPACE(name: string, namespace: unknown): void {
  CC_DEV && (window[name] = namespace);
}
