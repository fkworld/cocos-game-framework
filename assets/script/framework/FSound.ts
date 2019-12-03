import { DataSound, DataSoundKey, DataSoundValue } from "../data/DataSound";
import { FLocal } from "./FLocal";
import { FState } from "./FState";
import { G } from "./G";

const C = {
    PATH: "sound",          // 声音的存储路径
    DEFAULT_LOOP: false,    // 默认不循环
    DEFAULT_VOLUMN: 1,      // 默认音量为1
}

/** 声音的实例信息 */
interface DataSoundIns {
    state: FState.StateSet<"success" | "error"> // 声音实例状态
    url?: string,           // url
    volume?: number,        // 音量,默认为1
    loop?: boolean,         // 是否循环播放(bgm需要循环,音效不循环)
    clip?: cc.AudioClip,    // 声音的cc.AudioClip资源,默认为null
    id?: number,            // 声音的播放id,默认为null
}

/** 所有声音的实例信息，使用 Map */
type DataSoundAll = Map<string, DataSoundIns>

/**
 * [M] 声音管理
 * - 保存已经载入的声音,cc.AudioClip
 * - 保存已经播放的声音id
 */
export namespace FSound {

    let sound_all: DataSoundAll = new Map()

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
    async function get_sound(key: DataSoundKey): Promise<DataSoundIns> {
        let data = sound_all.get(key)
        // 如果已经有缓存,则直接返回
        if (data) { return data }
        // 如果没有缓存,则从数据文件中获取
        data = { state: new FState.StateSet("success") }
        let sound_source_data = DataSound[key] as DataSoundValue
        if (sound_source_data) {
            data.url = sound_source_data[0]
            data.volume = sound_source_data[1] || C.DEFAULT_VOLUMN
            data.loop = sound_source_data[2] || C.DEFAULT_LOOP
            data.clip = await G.load_res(`${C.PATH}/${sound_source_data[0]}`, cc.AudioClip)
        }
        // 获取失败,置state为error
        if (!data.clip) {
            data.state.change_state("error")
        }
        sound_all.set(key, data)
        return data
    }

    /** 播放一个声音 */
    export async function play(key: DataSoundKey) {
        if (!get_sound_switch()) { return }
        let data = await get_sound(key)
        if (data.state.has_state("error")) { return }
        // 特殊情况:bgm类型,如果已经在播放,则跳过
        if (data.loop
            && [cc.audioEngine.AudioState.INITIALZING, cc.audioEngine.AudioState.PLAYING]
                .includes(cc.audioEngine.getState(data.id))) {
            return
        }
        data.id = cc.audioEngine.play(data.clip, data.loop, data.volume)
    }

    /** 停止某一个声音 */
    export async function stop(key: DataSoundKey) {
        let data = await get_sound(key)
        if (data.state.has_state("error")) { return }
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
