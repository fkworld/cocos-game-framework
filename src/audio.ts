/**
 * 声音模块
 * - 用于处理游戏内的声音逻辑
 */

import { event_center } from "./event";
import { get_local, set_local } from "./local";
import { log, LogLevel } from "./log";
import { load_res } from "./tool-ccc";
import { SimpleFSM } from "./tool-fsm";

/** 事件：打开音乐开关 */
export const EVENT_MUSIC_SWITCH_OPEN = "audio/music-switch-open";

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
type AudioState = "prepare" | "ok" | "error";

/**
 * 声音类型
 * - music 音乐
 * - sound 音效
 */
type AudioType = "music" | "sound";

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

/** 所有声音的实例信息 */
let audios: Map<string, AudioIns>;

/** 音乐开关 */
let music_switch: boolean;

/** 音效开关 */
let sound_switch: boolean;

/**
 * 初始化
 * - TODO：在初始化中设置声音实例为1，可能会有bug，需要进一步测试
 * @param config
 */
export const _init_audio = (config: ConfigAudio = {}) => {
  audios = new Map(
    Object.entries(config).map(([k, v]) => {
      let ins: AudioIns = {
        fsm: new SimpleFSM<AudioState>("prepare", {
          prepare: ["ok", "error"],
          ok: [],
          error: [],
        }),
        type: k.includes("###") ? "music" : "sound",
        url: v,
      };
      // TODO：设置单实例，可能会有bug，需要测试
      cc.audioEngine.setMaxAudioInstance(1);
      return [k, ins];
    }),
  );
  music_switch = get_local("music") === "true";
  sound_switch = get_local("sound") === "true";
};

/** 获取音乐开关 */
export const get_music_switch = () => music_switch;

/** 反向音乐开关 */
export const reverse_music_switch = () => {
  music_switch = !music_switch;
  music_switch ? event_center.emit(EVENT_MUSIC_SWITCH_OPEN) : cc.audioEngine.stopAll();
  set_local("music", `${music_switch}`);
};

/** 获取音效开关 */
export const get_sound_switch = () => sound_switch;

/** 反向音乐开关 */
export const reverse_sound_switch = () => {
  sound_switch = !sound_switch;
  set_local("sound", `${sound_switch}`);
};

/**
 * 预载入一个audio
 * @param key
 */
export const pre_audio = async (key: string) => {
  let data = audios.get(key);
  if (!data.clip) {
    data.clip = await load_res(data.url, cc.AudioClip);
    data.fsm.try_go_state(data.clip ? "ok" : "error");
  }
  audios.set(key, data);
};

/**
 * 获取声音实例
 * @param key
 */
export const get_audio = async (key: string): Promise<AudioIns> => {
  await pre_audio(key);
  return audios.get(key);
};

/** 播放一个声音 */
export const play_audio = async (key: string) => {
  let data = await get_audio(key);
  if (
    data.fsm.is_state("error") ||
    (data.type === "music" && !music_switch) ||
    (data.type === "sound" && !sound_switch)
  ) {
    return;
  }
  data.id =
    data.type === "music"
      ? cc.audioEngine.playMusic(data.clip, true)
      : cc.audioEngine.playEffect(data.clip, false);
};

/** 停止某一个声音 */
export const stop_audio = async (key: string) => {
  let data = await get_audio(key);
  if (data.fsm.is_state("error")) {
    return;
  }
  data.id && cc.audioEngine.stop(data.id);
};
