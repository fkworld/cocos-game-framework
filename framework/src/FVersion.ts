import { FState } from "./FState"

/**
 * 版本管理模块
 * - 使用不同标记管理版本，1表示包含此标记，0表示不包含此标记
 * - 输出版本信息
 */
export namespace FVersion {

    /** 版本管理模块输出tag */
    const TAG = "@FVersion:"

    /** 版本标记信息 */
    export interface ConfigVersion {
        resetLocal: number,
        [k: string]: number,
    }

    /** 版本额外信息 */
    export interface ConfigVersionInfo {
        name: string,
        author: string,
        version: string,
        ios_version: string,
        android_version: string,
    }

    /**
     * 需要在app中初始化，并传入版本信息
     * @param data_version 版本标记信息
     * @param data_version_info 版本额外信息
     */
    export const init = (data_version: ConfigVersion, data_version_info: ConfigVersionInfo) => {
        version = new FState.StateTable(Object.entries(data_version).reduce((r, [k, v]) => {
            v && (r[k] = v)
            return r
        }, {}))
        cc.log(TAG, version.log_keys(), JSON.stringify(data_version_info))
    }

    /** 组合版本 */
    export let version: FState.StateTable<string, number>

    /** dev模式下全局变量；针对类的装饰器 */
    export const dev_console = (constructor: any) => {
        CC_DEV && (window[constructor.name] = constructor)
    }

    /** dev模式下全局变量；针对模块 */
    export const dev_console_namespace = (name: string, namespace: any) => {
        CC_DEV && (window[name] = namespace)
    }

}
