import { G } from "./f-global";
import { L } from "./f-local";
import { FMLog } from "./fm-log";

const C = {
    PATH: "sound",      // 资源路径
    SWITCH: true,       // 默认声音开关
    SOUND: {            // 声音极其对应的url数据
        "bgm": "test",
        "btn": "test",
    },
}

/** 声音类型 */
type TypeSound = keyof typeof C.SOUND;
/** 声音信息 */
interface DataSoundInstance {
    url: string,            // 声音的资源字符串
    loop?: boolean,         // 是否循环播放,是否为bgm,默认为false
    volume?: number,        // 音量,默认为1
    clip?: cc.AudioClip,    // 声音的cc.AudioClip资源,默认为null
    id?: number,            // 声音的播放id,默认为null
}

/**
 * [M] 声音管理
 * - 保存已经载入的声音,cc.AudioClip
 * - 保存已经播放的声音id
 */
export class FMSound {

    /** 初始化本地存储 */
    static init_local() {
        L.sound = C.SWITCH
    }

    static ins: FMSound;

    /** 初始化 */
    static init() {
        G.check_ins(FMSound)
        FMSound.ins = new FMSound()
        // 初始化声音
        FMSound.ins.map_sound_ins.set("bgm", { url: C.SOUND["bgm"], loop: true })
        FMSound.ins.map_sound_ins.set("btn", { url: C.SOUND["btn"] })
        // check
        if (FMSound.ins.map_sound_ins.size != Object.keys(C.SOUND).length) {
            FMLog.warn("@FMSound: sound初始化个数异常")
        }
    }

    /** 声音的实例存储 */
    private map_sound_ins: Map<keyof typeof C.SOUND, DataSoundInstance> = new Map()

    /** 获取声音开关 */
    static get_sound_switch(): boolean {
        return L.sound
    }

    /** 设置声音开关(直接反向) */
    static set_sound_switch() {
        L.sound = !L.sound
        if (L.sound) {
            cc.audioEngine.pauseAll()
        } else {
            cc.audioEngine.resumeAll()
        }
    }

    /** 播放某一个声音:play/resume */
    static async play(sound: keyof typeof C.SOUND) {
        if (!L.sound) { return }
        let info = FMSound.ins.map_sound_ins.get(sound)
        // 载入audio clip资源
        if (!info.clip) {
            info.clip = await G.load_res(`${C.PATH}/${info.url}`, cc.AudioClip)
        }
        if (!info.clip) {
            FMLog.error(`@FMSound: audio clip no exsit, url=${info.url}`)
            return
        }
        if (info.loop) {
            // bgm类型,循环播放,只需要播放1次即可
            switch (cc.audioEngine.getState(info.id)) {
                case cc.audioEngine.AudioState.ERROR: case cc.audioEngine.AudioState.STOPPED:
                    info.id = cc.audioEngine.play(info.clip, info.loop, info.volume)
                    break;
                case cc.audioEngine.AudioState.PAUSED:
                    cc.audioEngine.resume(info.id)
                    break;
                default: case cc.audioEngine.AudioState.INITIALZING: case cc.audioEngine.AudioState.PLAYING:
                    break;
            }
        } else {
            // 普通音效类型,重复播放,相互独立
            info.id = cc.audioEngine.play(info.clip, info.loop, info.volume)
        }
    }

    /** 停止某一个声音:stop/pause */
    static stop(sound: keyof typeof C.SOUND) {
        let info = FMSound.ins.map_sound_ins.get(sound)
        if (info.loop) {
            // bgm类型,pause
            cc.audioEngine.pause(info.id)
        } else {
            // 普通音效类型,stop
            cc.audioEngine.stop(info.id)
        }
    }

    // 常用声音

    static play_bgm() {
        FMSound.play("bgm")
    }

    static play_btn() {
        FMSound.play("btn")
    }

}