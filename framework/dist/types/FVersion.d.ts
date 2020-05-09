import { FState } from "./FState";
/**
 * 版本管理模块
 * - 使用不同标记管理版本，1表示包含此标记，0表示不包含此标记
 * - 输出版本信息
 */
export declare namespace FVersion {
    /** 版本标记信息 */
    interface ConfigVersion {
        resetLocal: number;
        [k: string]: number;
    }
    /** 版本额外信息 */
    interface ConfigVersionInfo {
        name: string;
        author: string;
        version: string;
        ios_version: string;
        android_version: string;
    }
    /**
     * 需要在app中初始化，并传入版本信息
     * @param data_version 版本标记信息
     * @param data_version_info 版本额外信息
     */
    const init: (data_version: ConfigVersion, data_version_info: ConfigVersionInfo) => void;
    /** 组合版本 */
    let version: FState.StateTable<string, number>;
    /** dev模式下全局变量；针对类的装饰器 */
    const dev_console: (constructor: any) => void;
    /** dev模式下全局变量；针对模块 */
    const dev_console_namespace: (name: string, namespace: any) => void;
}
