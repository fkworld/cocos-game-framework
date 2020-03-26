import { FLocal } from "./FLocal";
import { FState } from "./FState";
import { FTool } from "./FTool";
import { DataAudio } from "../data/DataAudio";

/**
 * 声音模块
 */
export namespace FAudio {

    /** 声音状态：准备，就绪，错误 */
    type AudioState = "prepare" | "ok" | "error"
    type AudioType = "music" | "sound"
    type AudioKey = keyof typeof DataAudio

    /** 声音的实例信息 */
    interface SoundIns {
        state: FState.StateJumpTable<AudioState>    // 状态
        type: AudioType         // 播放类型，音乐/音效
        url?: string,           // 声音文件的url
        clip?: cc.AudioClip,    // 声音的cc.AudioClip资源,默认为null
        id?: number,            // 声音的播放id,默认为null
    }

    /** 所有声音的实例信息，使用 Map */
    let sound_all: Map<string, SoundIns> = new Map()
    export let music_switch: boolean    // 音乐开关
    export let sound_switch: boolean    // 音效开关

    export function init() {
        music_switch = FLocal.get("music") === "true"
        sound_switch = FLocal.get("sound") === "true"
    }

    function save() {
        FLocal.set("music", `${music_switch}`)
        FLocal.set("sound", `${sound_switch}`)
    }

    export function reverse_music() {
        music_switch = !music_switch
        save()
        music_switch ? play_bgm() : cc.audioEngine.stopAll()
    }

    export function reverse_sound() {
        sound_switch = !sound_switch
        save()
    }

    /** 获取声音数据 */
    async function get_sound(key: AudioKey): Promise<SoundIns> {
        // 如果已经有缓存，则直接返回
        let data = sound_all.get(key)
        if (data) { return data }
        // 如果没有缓存，则从数据文件中获取
        data = {
            state: new FState.StateJumpTable<AudioState>({
                "prepare": ["ok", "error"],
                "ok": [],
                "error": [],
            }, "prepare"),
            type: key.includes("###") ? "music" : "sound",
            url: DataAudio[key],
        }
        if (data.url) {
            data.clip = await FTool.load_res(data.url, cc.AudioClip)
            data.state.try_change_state(data.clip ? "ok" : "error")
        } else {
            data.state.try_change_state("error")
        }
        // 获取后保存并返回
        sound_all.set(key, data)
        return data
    }

    /** 播放一个声音 */
    export async function play(key: AudioKey) {
        let data = await get_sound(key)
        if (data.state.check_state("error")) { return }
        if (data.type === "music" && !music_switch) { return }
        if (data.type === "sound" && !sound_switch) { return }
        // 特殊情况：bgm 类型，如果已经在播放，则跳过
        if (data.type === "music"
            && [cc.audioEngine.AudioState.INITIALZING, cc.audioEngine.AudioState.PLAYING]
                .includes(cc.audioEngine.getState(data.id))) {
            return
        }
        data.id = cc.audioEngine.play(data.clip, data.type === "music", 1)
    }

    /** 停止某一个声音 */
    export async function stop(key: AudioKey) {
        let data = await get_sound(key)
        if (data.state.check_state("error")) { return }
        cc.audioEngine.stop(data.id)
    }

    export function play_bgm() {
        play("###bgm")
    }

    export function play_btn_ok() {
        play("btn_ok")
    }

    export function play_btn_cancel() {
        play("btn_cancel")
    }

}
