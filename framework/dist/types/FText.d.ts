/**
 * 多语言模块
 * - 使用key-value形式
 * - 不同语言对应不同的语言配置文件（或json）
 * - 【注意】需要在对应的配置文件中调用init_editor()方法，来保证可以在编辑器中使用
 */
export declare namespace FText {
    /** 事件：语言更改 */
    const EVENT_LANGUAGE_CHANGE = "@FText/language_change";
    /** 语言配置 */
    interface ConfigLanguage {
        [k: string]: ConfigText;
    }
    /** 文字配置 */
    interface ConfigText {
        [k: string]: string;
    }
    /**
     * 需要在app中初始化
     * @param config_language 语言配置
     */
    const init: (config_language: ConfigLanguage) => void;
    /**
     * 在编辑器中初始化
     * @param config_text
     */
    const init_editor: (config_text: ConfigText) => void;
    /** 获取当前的语言key */
    const get_language: () => string;
    /**
     * 修改当前语言
     * @param new_language
     */
    const change_language: (new_language: string) => void;
    /**
     * 获取语言数据，如果获取失败，则返回key
     * @param key
     * @param params
     */
    const get_text: (key: string, ...params: string[]) => string;
}
