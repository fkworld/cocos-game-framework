import { DataVersion, DataVersionInfo } from "../data/DataVersion"
import { FState } from "./FState"

/**
 * [framework] 版本管理
 */
export namespace FVersion {

    /** 版本类型 */
    type VersionKey = keyof typeof DataVersion

    /** 组合版本 */
    export let version: FState.StateSet<VersionKey>

    export function init() {
        version = new FState.StateSet(...Object.keys(DataVersion).filter(v => DataVersion[v] === 1) as VersionKey[])
        cc.log("@FVersion:", version.to_string(), JSON.stringify(DataVersionInfo))
    }

    /** 控制台的全局变量；针对类的装饰器 */
    export function dev_console(constructor: any) {
        if (version.has_state("globalConsole")) {
            window[constructor.name] = constructor
        }
    }

    /** 控制台的全局变量；针对模块 */
    export function dev_console_namespace(name: string, namespace: any) {
        if (version.has_state("globalConsole")) {
            window[name] = namespace
        }
    }

}
