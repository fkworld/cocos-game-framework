import { DataSound } from "../data/DataSound";
import { FLocal } from "./FLocal";
import { FState } from "./FState";
import { FTool } from "./FTool";

/**
 * [M] 声音管理
 * - 保存已经载入的声音,cc.AudioClip
 * - 保存已经播放的声音id
 */
export namespace FSound {

    /** 声音文件的存储路径 */
    const PATH = "sound"

    /** 所有声音的key */
    type TypeSoundKey = keyof typeof DataSound

    /** 所有声音的value类型，分别为：文件路径，音量大小（0-1），是否循环播放 */
    type TypeSoundValue = [string, number?, boolean?]

    /** 声音状态 */
    type SoundState = "prepare" | "ok" | "error"

    /** 声音的实例信息 */
    interface DataSoundIns {
        // 状态
        state: FState.StateJumpTable<SoundState>
        // 声音文件的url
        url?: string,
        // 音量,默认为1
        volume?: number,
        // 是否循环播放(bgm需要循环,音效不循环)
        loop?: boolean,
        // 声音的cc.AudioClip资源,默认为null
        clip?: cc.AudioClip,
        // 声音的播放id,默认为null
        id?: number,
    }

    /** 所有声音的实例信息，使用 Map */
    let sound_all: Map<string, DataSoundIns> = new Map()

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
    async function get_sound(key: TypeSoundKey): Promise<DataSoundIns> {
        // 如果已经有缓存,则直接返回
        let data = sound_all.get(key)
        if (data) { return data }
        // 如果没有缓存,则从数据文件中获取
        data = {
            state: new FState.StateJumpTable<SoundState>({
                "prepare": ["ok", "error"],
                "ok": [],
                "error": [],
            }, "prepare")
        }
        let sound_source_data = DataSound[key] as TypeSoundValue
        if (sound_source_data) {
            data.url = sound_source_data[0]
            data.volume = sound_source_data[1] || 1
            data.loop = sound_source_data[2] || false
            data.clip = await FTool.load_res(`${PATH}/${sound_source_data[0]}`, cc.AudioClip)
            data.state.try_change_state(data.clip ? "ok" : "error")
        } else {
            data.state.try_change_state("error")
        }
        // 获取后保存并返回
        sound_all.set(key, data)
        return data
    }

    /** 播放一个声音 */
    export async function play(key: TypeSoundKey) {
        if (!get_sound_switch()) { return }
        let data = await get_sound(key)
        if (data.state.check_state("error")) { return }
        // 特殊情况:bgm类型,如果已经在播放,则跳过
        if (data.loop
            && [cc.audioEngine.AudioState.INITIALZING, cc.audioEngine.AudioState.PLAYING]
                .includes(cc.audioEngine.getState(data.id))) {
            return
        }
        data.id = cc.audioEngine.play(data.clip, data.loop, data.volume)
    }

    /** 停止某一个声音 */
    export async function stop(key: TypeSoundKey) {
        let data = await get_sound(key)
        if (data.state.check_state("error")) { return }
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
