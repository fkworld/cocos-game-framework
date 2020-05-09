/**
 * 本地存储模块
 * - 【缓存】考虑在某些平台中localStorage方法的损耗，因此需要缓存
 * - 【注意】返回值均为string或者null。
 */
export declare namespace FLocal {
    /** 本地存储配置 */
    interface ConfigLocal {
        "language": "chinese";
        "music": true;
        "sound": true;
        [k: string]: string | boolean | number;
    }
    /** 初始化，如果是开发版本则一直初始化 */
    const init: (config: ConfigLocal) => void;
    /** 获取，顺序为：缓存，本地存储，配置的默认值 */
    const get: (key: string) => string;
    /** 存储 */
    const set: (key: string, value: string) => void;
}
