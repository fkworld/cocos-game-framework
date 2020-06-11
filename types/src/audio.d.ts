/**
 * 声音模块
 * - 用于处理游戏内的声音逻辑
 */
import { SimpleFSM } from "./tool-fsm";
/** 事件：打开音乐开关 */
export declare const EVENT_MUSIC_SWITCH_OPEN = "audio/music-switch-open";
/**
 * 声音配置
 * - key 中使用###来表示其为音乐类，否则为音效类
 * - value 表示声音文件的路径
 */
export interface ConfigAudio {
    [k: string]: string;
}
/**
 * 声音状态
 * - prepare 准备
 * - ok 载入成功
 * - error 载入失败
 */
declare type AudioState = "prepare" | "ok" | "error";
/**
 * 声音类型
 * - music 音乐
 * - sound 音效
 */
declare type AudioType = "music" | "sound";
/** 声音的实例信息 */
interface AudioIns {
    /** 状态机 */
    fsm: SimpleFSM<AudioState>;
    /** 声音类型 */
    type: AudioType;
    /** 声音文件的 url */
    url?: string;
    /** 声音的cc.AudioClip资源，默认为undefined */
    clip?: cc.AudioClip;
    /** 声音的播放 id */
    id?: number;
}
/**
 * 初始化
 * - TODO：在初始化中设置声音实例为1，可能会有bug，需要进一步测试
 * @param config
 */
export declare function _init_audio(config?: ConfigAudio): void;
/** 获取音乐开关 */
export declare function get_music_switch(): boolean;
/** 反向音乐开关 */
export declare function reverse_music_switch(): void;
/** 获取音效开关 */
export declare function get_sound_switch(): boolean;
/** 反向音乐开关 */
export declare function reverse_sound_switch(): void;
/**
 * 预载入一个audio
 * @param key
 */
export declare function pre_audio(key: string): Promise<void>;
/**
 * 获取声音实例
 * @param key
 */
export declare function get_audio(key: string): Promise<AudioIns>;
/** 播放一个声音 */
export declare function play_audio(key: string): Promise<void>;
/** 停止某一个声音 */
export declare function stop_audio(key: string): Promise<void>;
export {};
