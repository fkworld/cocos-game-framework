export {
    EVENT_MUSIC_SWITCH_OPEN,
    ConfigAudio,
    get_music_switch,
    get_sound_switch,
    reverse_music,
    reverse_sound,
    play_audio,
    stop_audio,
} from "./audio";
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

import { ConfigAudio, init_audio_runtime } from "./audio";
import { ConfigColor, init_color_editor, init_color_runtime } from "./color";
import { ConfigLocal, init_local_runtime } from "./local";
import { init_meta_editor_async, init_meta_runtime_async } from "./meta";
import { init_panel_runtime } from "./panel";
import { TAG } from "./share";
import { ConfigLanguage, init_text_editor, init_text_runtime } from "./text";
import { ConfigVersion, ConfigVersionInfo, init_version_editor, init_version_runtime } from "./version";

/** 当前版本号 */
export const VERSION = "1.0.0";

/** 当前版本时间 */
export const VERSION_TIME = "2020.5.11";

/** 框架初始化依赖配置 */
export interface Config {
    version: ConfigVersion,
    version_info: ConfigVersionInfo,
    local: ConfigLocal,
    color: ConfigColor,
    audio: ConfigAudio,
    text: ConfigLanguage,
    editor_language: string,
    meta_json_file: string,
    panel_parent: cc.Node,
}

/**
 * 在编辑器中初始化框架
 * @param config
 */
export const init_editor = async (config: Config) => {
    // 注意初始化次序
    init_version_editor(config.version)
    init_text_editor(config.text, config.editor_language)
    init_color_editor(config.color)
    await init_meta_editor_async(config.meta_json_file)
}

/**
 * 在运行时初始化框架
 * @param config
 */
export const init_runtime = async (config: Config) => {
    // 注意初始化次序
    init_version_runtime(config.version, config.version_info)
    init_local_runtime(config.local)
    init_text_runtime(config.text)
    init_color_runtime(config.color)
    init_audio_runtime(config.audio)
    await init_meta_runtime_async(config.meta_json_file)
    init_panel_runtime(config.panel_parent)
    cc.log(TAG, "初始化框架成功", VERSION, VERSION_TIME)
}
