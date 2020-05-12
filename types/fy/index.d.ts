export { EVENT_MUSIC_SWITCH_OPEN, ConfigAudio, get_music_switch, get_sound_switch, reverse_music, reverse_sound, play_audio, stop_audio, } from "./audio";
export { ConfigColor, get_color } from "./color";
export { event_center } from "./event";
export { ConfigLocal, get_local, set_local } from "./local";
export { MetaBase, DeSetMetaContext, get_meta, get_metas, get_metas_ids } from "./meta";
export { is_ios, is_android, is_native, call, call_async } from "./native";
export { PanelBase, DeSetPanelContext, open_panel, close_panel } from "./panel";
export * from "./share";
export { StateTable, SFSM, SimpleNodeAnima } from "./state";
export { ConfigLanguage, ConfigText, get_text, get_language, change_language, EVENT_LANGUAGE_CHANGE } from "./text";
export { ConfigVersion, ConfigVersionInfo, version, DeDevConsole, DeDevConsoleNamespace } from "./version";
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
