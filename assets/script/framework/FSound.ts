import { sound } from "../data/sound";
import { FLocal } from "./FLocal";
import { FLog } from "./FLog";
import { G } from "./G";

const C = {
    PATH: "sound",          // 声音的存储路径
    DEFAULT_LOOP: false,    // 默认不循环
    DEFAULT_VOLUMN: 1,      // 默认音量为1
}

/** 声音源数据的结构 */
type DataSoundSource = [string, number?, boolean?];
/** 所有声音的key */
type TypeSoundKey = keyof typeof sound;
/** 声音信息 */
interface DataSound {
    state: "success" | "error", // 状态,error表示出现错误,可能是key不存在,也可能是资源不存在
    url?: string,                // 声音的资源字符串
    volume?: number,             // 音量,默认为1
    loop?: boolean,              // 是否循环播放(bgm需要循环,音效不循环)
    clip?: cc.AudioClip,        // 声音的cc.AudioClip资源,默认为null
    id?: number,                // 声音的播放id,默认为null
}

/**
 * [M] 声音管理
 * - 保存已经载入的声音,cc.AudioClip
 * - 保存已经播放的声音id
 */
export namespace FSound {

    let sound_map: Map<string, DataSound> = new Map()

    /** 获取声音开关 */
    export function get_sound_switch(): boolean {
        return FLocal.get("sound") === `${true}`
    }

    /** 反向声音开关 */
    export function reverse_sound_switch() {
        FLocal.set("sound", `${!get_sound_switch()}`)
        get_sound_switch() ? play_bgm() : cc.audioEngine.stopAll()
    }

    /** 获取声音数据 */
    async function get_sound(key: TypeSoundKey): Promise<DataSound> {
        let data = sound_map.get(key)
        // 如果已经有缓存,则直接返回
        if (data) { return data }
        // 如果没有缓存,则从数据文件中获取
        let sound_source_data = sound[key] as DataSoundSource
        if (sound_source_data) {
            data = {
                state: "success",
                url: sound_source_data[0],
                volume: sound_source_data[1] || C.DEFAULT_VOLUMN,
                loop: sound_source_data[2] || C.DEFAULT_LOOP,
                clip: await G.load_res(`${C.PATH}/${sound_source_data[0]}`, cc.AudioClip)
            }
            sound_map.set(key, data)
        }
        // 获取失败,置state为error
        if (!data || !data.clip) {
            FLog.error(`@FSound: 声音资源载入错误, key=${key}`)
            data = { state: "error" }
            sound_map.set(key, data)
        }
        return data
    }

    /** 播放一个声音 */
    export async function play(key: TypeSoundKey) {
        if (!get_sound_switch()) { return }
        let data = await get_sound(key)
        if (data.state === "error") { return }
        // 特殊情况:bgm类型,如果已经在播放,则跳过
        if (data.loop) {
            let state = cc.audioEngine.getState(data.id)
            if ([cc.audioEngine.AudioState.INITIALZING, cc.audioEngine.AudioState.PLAYING].includes(state)) {
                return
            }
        }
        data.id = cc.audioEngine.play(data.clip, data.loop, data.volume)
    }

    /** 停止某一个声音 */
    export async function stop(key: TypeSoundKey) {
        let data = await get_sound(key)
        if (data.state === "error") { return }
        cc.audioEngine.stop(data.id)
    }

    /** 常用:播放bgm */
    export function play_bgm() {
        FSound.play("bgm")
    }

    /** 常用:播放按键音 */
    export function play_btn() {
        FSound.play("btn")
    }

}
