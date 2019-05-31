const C = {
    VERSION: <MVersionType>"dev",   // 默认为dev版本,打包时需要修改
    NAME: "cocos-game-framework",
    CREATOR: "skyfox-fengyong",
    VERSION_NUMBER: "0.0",
    VERSION_TIME: "2019-5-14",
}

/** 版本类型 */
type MVersionType = "dev" | "rc";

/**
 * [M] 环境管理,版本管理
 * - 运行环境,使用引擎自带宏变量,编辑器环境,发布环境等,具体参考https://docs.cocos.com/creator/api/zh/modules/GLOBAL-MACROS.html
 * - 自定义版本:开发版本,无广告版本等
 * - 自定义综合判定,环境+版本
 * - [注意] 这里均使用getter函数来简化,如果都不使用getter函数也可以,保持一致即可
 */
export class MVersion {

    // 获取游戏信息

    static get VERSION() { return C.VERSION }

    static get NAME() { return C.NAME }

    static get CREATOR() { return C.CREATOR }

    static get VERSION_NUMBER() { return C.VERSION_NUMBER }

    static get VERSION_TIME() { return C.VERSION_TIME }

    // 运行环境判定

    /** 编辑器环境 */
    static get run_editor() { return CC_EDITOR }

    // 运行版本判定

    /** 开发版本 */
    static get version_dev() { return C.VERSION === "dev" }

    // 自定义综合判定

    /** 编辑器环境+开发版本 */
    static get is_editor_and_dev() { return CC_EDITOR && C.VERSION === "dev" }
}
