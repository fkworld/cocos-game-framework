/**
 * 声音模块
 * @see https://www.yuque.com/fengyong/game-develop-road/anva67
 */

import { event_center } from "./event";
import { get_local, set_local } from "./local";
import { load_res_async } from "./tool-ccc";

/** 事件：打开音乐开关 */
export const EVENT_MUSIC_SWITCH_OPEN = "audio/music-switch-open";
/** 本地存储：音乐开关key */
const MUSIC_SWITCH_KEY = "audio/music-switch";
/** 本地存储：音效开关key */
const SOUND_SWITCH_KEY = "audio/sound-switch";

/**
 * 声音配置
 * @property key 使用###前缀来表示其为音乐，否则为音效
 * @property value 路径
 */
export interface ConfigAudio {
  [k: string]: string;
}

/** 声音状态 */
enum AudioState {
  /** 准备中 */
  Prepare,
  /** 完毕 */
  Ok,
  /** 失败 */
  Error,
}

/** 声音类型 */
enum AudioType {
  /** 音乐 */
  Music,
  /** 音效 */
  Sound,
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

/** 所有声音的实例信息 */
let audios: Map<string, AudioIns>;
/** 音乐开关默认值 */
let music_switch_default: boolean;
/** 音效开关默认值 */
let sound_switch_default: boolean;

/**
 * 初始化声音模块
 * @since 1.0.0
 * @param config
 * @param music_switch
 * @param sound_switch
 * @todo 在初始化中设置声音实例为1，可能会有bug，需要进一步测试
 */
export function _init_audio(
  config: ConfigAudio = {},
  music_switch: boolean,
  sound_switch: boolean,
): void {
  audios = new Map(
    Object.entries(config).map(([k, v]) => {
      let ins: AudioIns = {
        state: AudioState.Prepare,
        type: k.startsWith("###") ? AudioType.Music : AudioType.Sound,
        url: v,
      };
      cc.audioEngine.setMaxAudioInstance(1);
      return [k, ins];
    }),
  );
  music_switch_default = music_switch;
  sound_switch_default = sound_switch;
}

/**
 * 获取音乐开关
 * @since 1.0.0
 */
export function get_music_switch(): boolean {
  return get_local(MUSIC_SWITCH_KEY, `${music_switch_default}`) === "true";
}

/**
 * 反向音乐开关
 * @since 1.0.0
 */
export function reverse_music_switch(): void {
  set_local(MUSIC_SWITCH_KEY, `${!get_music_switch()}`);
  get_music_switch() ? event_center.emit(EVENT_MUSIC_SWITCH_OPEN) : cc.audioEngine.stopAll();
}

/**
 * 获取音效开关
 * @since 1.0.0
 */
export function get_sound_switch(): boolean {
  return get_local(SOUND_SWITCH_KEY, `${sound_switch_default}`) === "true";
}

/**
 * 反向音效开关
 * @since 1.0.0
 */
export function reverse_sound_switch(): void {
  set_local(SOUND_SWITCH_KEY, `${!get_sound_switch()}`);
}

/**
 * 预载入一个audio
 * @since 1.0.0
 * @param key
 */
export async function pre_audio(key: string): Promise<void> {
  let data = audios.get(key);
  if (data.state === AudioState.Prepare && !data.clip) {
    data.clip = await load_res_async(data.url, cc.AudioClip);
    data.state = data.clip ? AudioState.Ok : AudioState.Error;
  }
  audios.set(key, data);
}

/**
 * 获取声音实例
 * @since 1.0.0
 * @param key
 */
export async function get_audio(key: string): Promise<AudioIns> {
  await pre_audio(key);
  return audios.get(key);
}

/**
 * 播放一个声音
 * @since 1.0.0
 * @param key
 */
export async function play_audio(key: string): Promise<void> {
  let data = await get_audio(key);
  if (
    data.state === AudioState.Error ||
    (data.type === AudioType.Music && !get_music_switch()) ||
    (data.type === AudioType.Sound && !get_sound_switch())
  ) {
    return;
  }
  data.id =
    data.type === AudioType.Music
      ? cc.audioEngine.playMusic(data.clip, true)
      : cc.audioEngine.playEffect(data.clip, false);
}

/**
 * 停止某一个声音
 * @since 1.0.0
 * @param key
 */
export async function stop_audio(key: string): Promise<void> {
  let data = await get_audio(key);
  if (data.state === AudioState.Error) {
    return;
  }
  data.id && cc.audioEngine.stop(data.id);
}
