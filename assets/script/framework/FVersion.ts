const C = {
    NAME: "cocos-game-framework",
    CREATOR: "skyfox-fengyong",
    VERSION_NUMBER: "0.0",
    VERSION_TIME: "2019-5-14",
    VERSION: ["dev"] as TypeVersion[],
}

/**
 * 版本类型
 * 1. dev   开发版本
 * 2. rc    正式版本
 */
type TypeVersion = "dev" | "rc";

/**
 * [M] 环境管理,版本管理
 * - 运行环境,使用引擎自带宏变量,编辑器环境,发布环境等,具体参考https://docs.cocos.com/creator/api/zh/modules/GLOBAL-MACROS.html
 * - 允许多版本标记同时存在
 */
export class FVersion {

    // 获取游戏信息

    static get_name() { return C.NAME }

    static get_creator() { return C.CREATOR }

    static get_version_number() { return C.VERSION_NUMBER }

    static get_version_time() { return C.VERSION_TIME }

    static get_version_string() { return C.VERSION.toString() }

    // 运行环境判定

    /** 编辑器环境 */
    static is_editor() { return CC_EDITOR }

    /** 预览环境 */
    static is_preview() { return CC_PREVIEW }

    // 运行版本判定

    /** 开发版本 */
    static is_dev() { return C.VERSION.includes("dev") }

    static is_rc() { return C.VERSION.includes("rc") }

}
