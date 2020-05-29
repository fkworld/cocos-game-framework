/**
 * 版本管理模块
 * - 通过版本标记管理游戏版本。
 * - 使用正向含义标记。
 * - 需要在运行时初始化，传入2个配置数据：ConfigVersion，ConfigVersionInfo。
 */
import { StateTable } from "./tool-state-table";
/**
 * 版本标记信息
 * - key 表示版本标记
 * - value 表示是否包含此标记，1表示包含，0表示不包含
 */
export interface ConfigVersion {
    /** 是否清空本地存储 */
    resetLocal: number;
    [k: string]: number;
}
/**
 * 版本额外信息
 * - 仅作为显示使用，如果没有，可以传undefined
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
export declare let version_center: StateTable<string, number>;
/**
 * 初始化版本信息
 * @param config 版本标记信息
 * @param info 版本额外信息
 */
export declare const _init_version: (config?: ConfigVersion, info?: ConfigVersionInfo) => void;
/** dev模式下全局变量，针对类的装饰器 */
export declare const DeDevConsole: (constructor: any) => void;
/** dev模式下全局变量，针对模块 */
export declare const DeDevConsoleNamespace: (name: string, namespace: any) => void;
