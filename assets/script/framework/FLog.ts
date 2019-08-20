/**
 * [framework] log信息管理工具
 * - 可以在自定义log中附带一些额外操作,比如传输错误给服务器等等
 */
export namespace FLog {

    export function log(...msg: any[]) {
        console.log("@log", ...msg)
    }

    export function warn(...msg: any[]) {
        console.warn("@warn", ...msg)
    }

    export function error(...msg: any[]) {
        console.error("@error", ...msg)
    }

    export function major_error(...msg: any[]) {
        console.error("@major-error", ...msg)
    }
}
