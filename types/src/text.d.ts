/**
 * 文字数据模块
 * - 需要初始化，传入文字配置数据，编辑器默认语言，运行时默认语言
 * @see https://www.yuque.com/fengyong/game-develop-road/gepz3f
 */
/** 事件：语言更改 */
export declare const EVENT_LANGUAGE_CHANGE = "text/language-change";
/**
 * 语言配置
 * @property key 表示语言
 * @property value 表示语言配置文件
 */
export interface ConfigLanguage {
    /** 默认为中文 */
    chinese?: {
        [k: string]: string;
    };
    [k: string]: ConfigLanguage["chinese"];
}
/**
 * 初始化文字数据模块
 * @since 1.0.0
 * @param config
 * @param editor 编辑器默认语言
 * @param runtime 运行时默认语言
 */
export declare function _init_text(config: ConfigLanguage, editor: string, runtime: string): void;
/**
 * 获取当前的语言key
 * - 区分编辑器中和运行时
 * @since 1.0.0
 */
export declare function get_language(): string;
/**
 * 修改当前语言
 * @since 1.0.0
 * @param language_key
 */
export declare function change_language(language_key: string): void;
/**
 * 获取语言数据，如果获取失败，则返回key
 * @since 1.0.0
 * @param text_key
 * @param params
 */
export declare function get_text(text_key: string, ...params: string[]): string;
/**
 * 设置节点的text数据
 * - 支持3种组件，cc.Label/cc.RichText/cc.Sprite
 * @since 1.0.0
 * @param node
 * @param key
 * @param params
 */
export declare function set_node_text(node: cc.Node, key: string, ...params: string[]): void;
