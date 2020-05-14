export * from "./audio";
export * from "./color";
export * from "./event";
export * from "./local";
export * from "./meta";
export * from "./native";
export * from "./panel";
export * from "./state-node-anima";
export * from "./state-sfsm";
export * from "./state-table";
export * from "./text";
export * from "./tool";
export * from "./tool-ccc";
export * from "./tool-random";
export * from "./version";
import { ConfigAudio } from "./audio";
import { ConfigColor } from "./color";
import { ConfigLocal } from "./local";
import { ConfigLanguage } from "./text";
import { ConfigVersion, ConfigVersionInfo } from "./version";
/** 当前版本号 */
export declare const VERSION = "1.0.0";
/** 当前版本时间 */
export declare const VERSION_TIME = "2020.5.11";
/** 框架初始化依赖配置 */
export interface Config {
    version: ConfigVersion;
    version_info: ConfigVersionInfo;
    local: ConfigLocal;
    color: ConfigColor;
    audio: ConfigAudio;
    text: ConfigLanguage;
    editor_language: string;
    meta_json_file: string;
    panel_parent: cc.Node;
}
/**
 * 在编辑器中初始化框架
 * @param config
 */
export declare const init_editor: (config: Config) => Promise<void>;
/**
 * 在运行时初始化框架
 * @param config
 */
export declare const init_runtime: (config: Config) => Promise<void>;
