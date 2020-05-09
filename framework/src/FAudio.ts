import { FEvent } from "./FEvent";
import { FLocal } from "./FLocal";
import { FState } from "./FState";
import { FTool } from "./FTool";

/**
 * 声音模块
 * - 使用key-value形式配置，value表示路径，value包含###前缀则表示music，否则表示sound
 */
export namespace FAudio {

    /** 输出log */
    const TAG = "@FAudio:"

    /** 事件，打开音乐开关 */
    export const EVENT_OPEN_MUSIC_SWITCH = "@FAudio/open_music_switch"

    /** 声音配置 */
    export interface ConfigAudio {
        [k: string]: string
    }

    /** 声音状态：准备，就绪，错误 */
    type AudioState = "prepare" | "ok" | "error"

    /** 声音类型：音乐，音效 */
    type AudioType = "music" | "sound"

    /** 声音的实例信息 */
    interface AudioIns {
        fsm: FState.SFSM<AudioState>    // 状态机
        type: AudioType                 // 播放类型，音乐/音效
        url?: string,                   // 声音文件的url
        clip?: cc.AudioClip,            // 声音的cc.AudioClip资源,默认为null
        id?: number,                    // 声音的播放id,默认为null
    }

    /**
     * 初始化
     * @param config
     */
    export const init = (config: ConfigAudio) => {
        audio_all = new Map(Object.entries(config).map(([k, v]) => {
            let ins: AudioIns = {
                fsm: new FState.SFSM<AudioState>({
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
        music_switch = FLocal.get("music") === "true"
        sound_switch = FLocal.get("sound") === "true"
    }

    /** 所有声音的实例信息 */
    let audio_all: Map<string, AudioIns> = new Map()

    /** 音乐开关 */
    let music_switch: boolean    // 音乐开关

    /** 音效开关 */
    let sound_switch: boolean    // 音效开关

    /** 保存到本地 */
    function save() {
        FLocal.set("music", `${music_switch}`)
        FLocal.set("sound", `${sound_switch}`)
    }

    /** 获取音乐开关 */
    export const get_music_switch = () => music_switch

    /** 反向音乐开关 */
    export const reverse_music = () => {
        music_switch = !music_switch
        music_switch
            ? FEvent.center.emit(EVENT_OPEN_MUSIC_SWITCH)
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
            data.clip = await FTool.load_res(data.url, cc.AudioClip)
            data.fsm.try_go_state(data.clip ? "ok" : "error")
        }
        audio_all.set(key, data)
        return data
    }

    /** 播放一个声音 */
    export const play = async (key: string) => {
        let data = await get_audio_ins(key)
        if (data.fsm.is_state("error")) { return }
        if (data.type === "music" && !music_switch) { return }
        if (data.type === "sound" && !sound_switch) { return }
        data.id = data.type === "music"
            ? cc.audioEngine.playMusic(data.clip, true)
            : cc.audioEngine.playEffect(data.clip, false)
    }

    /** 停止某一个声音 */
    export const stop = async (key: string) => {
        let data = await get_audio_ins(key)
        if (data.fsm.is_state("error")) { return }
        data.id && cc.audioEngine.stop(data.id)
    }

}
