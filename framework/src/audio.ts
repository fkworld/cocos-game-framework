// 声音模块

import { event_center } from "./event"
import { get_local, set_local } from "./local"
import { load_res } from "./share"
import { SFSM } from "./state"

/** 事件，打开音乐开关 */
export const EVENT_MUSIC_SWITCH_OPEN = "@event:audio/music-switch-open"

/**
 * 声音配置
 * - key中使用“###”来表示其为音乐类，否则为音效类
 * - value为声音文件的路径
 */
export interface ConfigAudio {
    [k: string]: string
}

/** 声音状态：准备，就绪，错误 */
type AudioState = "prepare" | "ok" | "error"

/** 声音类型：音乐，音效 */
type AudioType = "music" | "sound"

/** 声音的实例信息 */
interface AudioIns {
    fsm: SFSM<AudioState>    // 状态机
    type: AudioType                 // 播放类型，音乐/音效
    url?: string,                   // 声音文件的url
    clip?: cc.AudioClip,            // 声音的cc.AudioClip资源,默认为null
    id?: number,                    // 声音的播放id,默认为null
}

/**
 * 初始化
 * @param config
 */
export const init_audio_runtime = (config: ConfigAudio) => {
    audio_all = new Map(Object.entries(config).map(([k, v]) => {
        let ins: AudioIns = {
            fsm: new SFSM<AudioState>({
                id: "AudioSFSM",
                initial: "prepare",
                states: {
                    "prepare": ["ok", "error"],
                    "ok": [],
                    "error": [],
                }
            }),
            type: k.includes("###") ? "music" : "sound",
            url: v,
        }
        // TODO：设置单实例，可能会有bug，需要测试
        cc.audioEngine.setMaxAudioInstance(1)
        return [k, ins]
    }))
    music_switch = get_local("music") === "true"
    sound_switch = get_local("sound") === "true"
}

/** 所有声音的实例信息 */
let audio_all: Map<string, AudioIns> = new Map()

/** 音乐开关 */
let music_switch: boolean    // 音乐开关

/** 音效开关 */
let sound_switch: boolean    // 音效开关

/** 保存到本地 */
function save() {
    set_local("music", `${music_switch}`)
    set_local("sound", `${sound_switch}`)
}

/** 获取音乐开关 */
export const get_music_switch = () => music_switch

/** 反向音乐开关 */
export const reverse_music = () => {
    music_switch = !music_switch
    music_switch
        ? event_center.emit(EVENT_MUSIC_SWITCH_OPEN)
        : cc.audioEngine.stopAll()
    save()
}

/** 获取音效开关 */
export const get_sound_switch = () => sound_switch

/** 反向音乐开关 */
export const reverse_sound = () => {
    sound_switch = !sound_switch
    save()
}

/**
 * 获取声音实例
 * @param key
 */
const get_audio_ins = async (key: string): Promise<AudioIns> => {
    let data = audio_all.get(key)
    if (!data.clip) {
        data.clip = await load_res(data.url, cc.AudioClip)
        data.fsm.try_go_state(data.clip ? "ok" : "error")
    }
    audio_all.set(key, data)
    return data
}

/** 播放一个声音 */
export const play_audio = async (key: string) => {
    let data = await get_audio_ins(key)
    if (data.fsm.is_state("error")) { return }
    if (data.type === "music" && !music_switch) { return }
    if (data.type === "sound" && !sound_switch) { return }
    data.id = data.type === "music"
        ? cc.audioEngine.playMusic(data.clip, true)
        : cc.audioEngine.playEffect(data.clip, false)
}

/** 停止某一个声音 */
export const stop_audio = async (key: string) => {
    let data = await get_audio_ins(key)
    if (data.fsm.is_state("error")) { return }
    data.id && cc.audioEngine.stop(data.id)
}
