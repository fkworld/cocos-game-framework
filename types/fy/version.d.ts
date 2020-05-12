import { StateTable } from "./state";
/** 版本标记信息 */
export interface ConfigVersion {
    /** 是否清空本地存储 */
    resetLocal: number;
    [k: string]: number;
}
/** 版本额外信息 */
export interface ConfigVersionInfo {
    /** 项目名称 */
    name: string;
    /** 项目作者 */
    author: string;
    /** 项目版本，例如：1.0.0/2020.5.11 */
    version: string;
    /** ios项目打包版本，例如：1.0.0/2020051101/2020.5.11 */
    ios_version: string;
    /** android项目打包版本，例如：1.0.0/2020051102/2020.5.11 */
    android_version: string;
}
/** 组合版本 */
export declare let version: StateTable<string, number>;
/**
 * 在编辑器中初始化版本模块
 * @param config 版本标记信息
 */
export declare const init_version_editor: (config: ConfigVersion) => void;
/**
 * 在运行时初始化版本模块
 * @param config 版本标记信息
 * @param info 版本额外信息
 */
export declare const init_version_runtime: (config: ConfigVersion, info: ConfigVersionInfo) => void;
/** dev模式下全局变量；针对类的装饰器 */
export declare const DeDevConsole: (constructor: any) => void;
/** dev模式下全局变量；针对模块 */
export declare const DeDevConsoleNamespace: (name: string, namespace: any) => void;
