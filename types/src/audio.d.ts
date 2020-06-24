/**
 * 声音模块
 * @see https://www.yuque.com/fengyong/game-develop-road/anva67
 */
/** 事件：打开音乐开关 */
export declare const EVENT_MUSIC_SWITCH_OPEN = "audio/music-switch-open";
/**
 * 声音配置
 * @property key 使用###前缀来表示其为音乐，否则为音效
 * @property value 路径
 */
export interface ConfigAudio {
    [k: string]: string;
}
/** 声音状态 */
declare enum AudioState {
    /** 准备中 */
    Prepare = 0,
    /** 完毕 */
    Ok = 1,
    /** 失败 */
    Error = 2
}
/** 声音类型 */
declare enum AudioType {
    /** 音乐 */
    Music = 0,
    /** 音效 */
    Sound = 1
}
/** 声音的实例信息 */
interface AudioIns {
    /** 状态 */
    state: AudioState;
    /** 声音类型 */
    type: AudioType;
    /** 声音的url */
    url?: string;
    /** 声音的cc.AudioClip资源，默认为undefined */
    clip?: cc.AudioClip;
    /** 声音的播放id */
    id?: number;
}
/**
 * 初始化声音模块
 * @since 1.0.0
 * @param config
 * @param music_switch
 * @param sound_switch
 * @todo 在初始化中设置声音实例为1，可能会有bug，需要进一步测试
 */
export declare function _init_audio(config: ConfigAudio, music_switch: boolean, sound_switch: boolean): void;
/**
 * 获取音乐开关
 * @since 1.0.0
 */
export declare function get_music_switch(): boolean;
/**
 * 反向音乐开关
 * @since 1.0.0
 */
export declare function reverse_music_switch(): void;
/**
 * 获取音效开关
 * @since 1.0.0
 */
export declare function get_sound_switch(): boolean;
/**
 * 反向音效开关
 * @since 1.0.0
 */
export declare function reverse_sound_switch(): void;
/**
 * 预载入一个audio
 * @since 1.0.0
 * @param key
 */
export declare function pre_audio(key: string): Promise<void>;
/**
 * 获取声音实例
 * @since 1.0.0
 * @param key
 */
export declare function get_audio(key: string): Promise<AudioIns>;
/**
 * 播放一个声音
 * @since 1.0.0
 * @param key
 */
export declare function play_audio(key: string): Promise<void>;
/**
 * 停止某一个声音
 * @since 1.0.0
 * @param key
 */
export declare function stop_audio(key: string): Promise<void>;
export {};
