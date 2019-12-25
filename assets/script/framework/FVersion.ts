import { DataVersion, DataVersionInfo } from "../data/DataVersion"
import { FState } from "./FState"

/** 版本类型 */
type TypeVersionKey = keyof typeof DataVersion

/**
 * [framework] 版本管理
 */
export namespace FVersion {

    /** 组合版本 */
    const version = new FState.StateSet<TypeVersionKey>(
        ...Object.keys(DataVersion).filter(v => DataVersion[v] === 1) as TypeVersionKey[]
    )

    /** 获取当前版本标记 */
    export function get_version() {
        return version
    }

    /** 输出当前游戏的版本信息 */
    export function log_version() {
        cc.log(Object.assign(DataVersionInfo, { versions: version }))
    }

}
