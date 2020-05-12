/** 事件，打开音乐开关 */
export declare const EVENT_MUSIC_SWITCH_OPEN = "@event:audio/music-switch-open";
/**
 * 声音配置
 * - key中使用“###”来表示其为音乐类，否则为音效类
 * - value为声音文件的路径
 */
export interface ConfigAudio {
    [k: string]: string;
}
/**
 * 初始化
 * @param config
 */
export declare const init_audio_runtime: (config: ConfigAudio) => void;
/** 获取音乐开关 */
export declare const get_music_switch: () => boolean;
/** 反向音乐开关 */
export declare const reverse_music: () => void;
/** 获取音效开关 */
export declare const get_sound_switch: () => boolean;
/** 反向音乐开关 */
export declare const reverse_sound: () => void;
/** 播放一个声音 */
export declare const play_audio: (key: string) => Promise<void>;
/** 停止某一个声音 */
export declare const stop_audio: (key: string) => Promise<void>;
