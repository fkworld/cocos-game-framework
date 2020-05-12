/** 事件：语言更改 */
export declare const EVENT_LANGUAGE_CHANGE = "@event:text/language-change";
/** 语言配置 */
export interface ConfigLanguage {
    /** 默认为中文 */
    "chinese": ConfigText;
    [k: string]: ConfigText;
}
/** 文字配置 */
export interface ConfigText {
    [k: string]: string;
}
/**
 * 在运行时初始化text模块
 * @param config
 */
export declare const init_text_runtime: (config: ConfigLanguage) => void;
/**
 * 在编辑器中初始化text模块
 * @param config
 * @param editor 编辑器默认语言
 */
export declare const init_text_editor: (config: ConfigLanguage, editor: string) => void;
/** 获取当前的语言key */
export declare const get_language: () => string;
/**
 * 修改当前语言
 * @param new_language
 */
export declare const change_language: (new_language: string) => void;
/**
 * 获取语言数据，如果获取失败，则返回key
 * @param key
 * @param params
 */
export declare const get_text: (key: string, ...params: string[]) => string;
