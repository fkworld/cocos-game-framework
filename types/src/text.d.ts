/**
 * 多语言模块
 * - 需要在编辑器中，运行时初始化，传入2个配置数据：ConfigLanguage，编辑器语言
 */
/** 事件：语言更改 */
export declare const EVENT_LANGUAGE_CHANGE = "text/language-change";
/**
 * 语言配置
 * - key 表示语言
 * - value 表示语言配置文件
 */
export interface ConfigLanguage {
    /** 默认为中文 */
    chinese: {
        [k: string]: string;
    };
    [k: string]: ConfigLanguage["chinese"];
}
/**
 * 在编辑器中初始化 text 模块
 * @param config
 * @param editor 编辑器默认语言
 */
export declare function _init_text(config?: ConfigLanguage, editor?: string): void;
/** 获取当前的语言 key */
export declare function get_language(): string;
/**
 * 修改当前语言
 * @param new_language
 */
export declare function change_language(new_language: string): void;
/**
 * 获取语言数据，如果获取失败，则返回 key
 * @param key
 * @param params
 */
export declare function get_text(key: string, ...params: string[]): string;
/**
 * 设置节点的text数据
 * @param node
 * @param key
 * @param params
 */
export declare function set_node_text(node: cc.Node, key: string, ...params: string[]): void;
