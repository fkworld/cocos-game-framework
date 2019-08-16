import { FLocal } from "./FLocal";
import { FLog } from "./FLog";
import { G } from "./G";
import { DataSound, SOUND, SOUND_PATH } from "../data/sound";

/** 声音信息 */
interface DataSoundInstance extends DataSound {
    clip?: cc.AudioClip,    // 声音的cc.AudioClip资源,默认为null
    id?: number,            // 声音的播放id,默认为null
}

/**
 * [M] 声音管理
 * - 保存已经载入的声音,cc.AudioClip
 * - 保存已经播放的声音id
 */
export namespace FSound {

    let map_sound: Map<string, DataSoundInstance> = new Map()

    /** 获取声音开关 */
    export function get_sound_switch(): boolean {
        return FLocal.get("sound") === `${true}`
    }

    /** 反向声音开关 */
    export function reverse_sound_switch() {
        FLocal.set("sound", `${!get_sound_switch()}`)
        if (get_sound_switch()) {
            play_bgm() // TODO:目前仅支持在开关打开时播放背景音乐
        } else {
            cc.audioEngine.stopAll()
        }
    }

    /** 播放一个声音 */
    export async function play(key: keyof typeof SOUND) {
        if (!get_sound_switch()) { return }
        let info = map_sound.get(key)
        if (!info) {
            info = SOUND[key]
            map_sound.set(key, info)
        }
        // 载入audio-clip资源
        if (!info.clip) {
            info.clip = await G.load_res(`${SOUND_PATH}/${info.url}`, cc.AudioClip)
        }
        if (!info.clip) { return }
        // 特殊情况:bgm类型,如果已经在播放,则跳过
        if (info.loop) {
            let state = cc.audioEngine.getState(info.id)
            if ([cc.audioEngine.AudioState.INITIALZING, cc.audioEngine.AudioState.PLAYING].includes(state)) {
                return
            }
        }
        info.id = cc.audioEngine.play(info.clip, info.loop, info.volume)
    }

    /** 停止某一个声音 */
    export function stop(key: keyof typeof SOUND) {
        let info = map_sound.get(key)
        cc.audioEngine.stop(info.id)
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
