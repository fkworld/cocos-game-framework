/**
 * 版本类型;注意使用正向描述(即不要使用no-*这样的描述)
 * - dev   开发版本
 * - rc    正式版本
 */
type TypeVersion = "dev" | "rc";

/**
 * [framework] 环境+版本管理
 * - 运行环境,使用引擎自带宏变量,编辑器环境,发布环境等,具体参考https://docs.cocos.com/creator/api/zh/modules/GLOBAL-MACROS.html
 * - 允许多版本标记同时存在
 */
export namespace FVersion {

    /** 游戏信息 */
    const game_info = {
        name: "cocos-game-framework",
        creator: "skyfox-fengyong",
        version_number: "0.1",
        version_time: "2019-8-21",
    }
    /** 组合版本 */
    const versions: Set<TypeVersion> = new Set(["dev"] as TypeVersion[])

    // 获取游戏信息

    export function get_name() { return game_info.name }
    export function get_creator() { return game_info.creator }
    export function get_version_number() { return game_info.version_number }
    export function get_version_time() { return game_info.version_time }
    export function get_version_string() { return `${versions}` }

    // 运行环境判定

    export function is_editor() { return CC_EDITOR }        // 编辑器环境
    export function is_preview() { return CC_PREVIEW }      // 预览环境

    // 运行版本判定

    export function is_dev() { return versions.has("dev") } // 开发版本
    export function is_rc() { return versions.has("rc") }   // 正式版本

}
