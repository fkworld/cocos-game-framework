import { L } from "./L";
import { MRes } from "./MRes";
import { G } from "./G";

/** 声音类别：音乐/音效 */
enum TYPE { MUSIC, EFFECT }
/** 声音具体区分名称 */
enum SOUND { test_music, test_effect }
const C = {
    PATH: 'sound',
}

/**
 * [framework-M] 声音管理
 * - 保存已经载入的声音，cc.AudioClip
 * - 保存已经播放的声音id
 * - 实现对音乐（唯一、循环）和音效（多个、单次）的统一API（play、stop）的播放管理
 */
export class MSound {

    static ins: MSound

    /** 初始化 */
    static init() {
        G.check_ins(MSound)
        MSound.ins = new MSound()
        MSound.ins.init_data()
    }

    /** 与SOUND一一对应的具体声音信息 */
    array_sound_info: ControllerSound[] = []

    /** 初始化声音数据 */
    init_data() {
        this.array_sound_info[SOUND.test_music] = new ControllerSound('test', TYPE.MUSIC, 1)
        this.array_sound_info[SOUND.test_effect] = new ControllerSound('test', TYPE.EFFECT, 1)
        // 针对music预播放1次
        for (let csound of this.array_sound_info) {
            if (csound.type === TYPE.MUSIC) {
                csound.play().then(() => { csound.stop() })
            }
        }
    }

    /** 初始化本地存储 */
    static init_l() { L.set_sound(true) }

    /** 获取声音开关 */
    static get_sound_switch() { return L.get_sound() === `${true}` }

    /** 设置声音开关（直接反向） */
    static set_sound_switch() {
        L.set_sound(L.get_sound() === `${true}` ? false : true)
        if (MSound.get_sound_switch()) {
            MSound.resume_all()
        } else {
            MSound.pause_all()
        }
    }

    /** 声音的具体区分名称 */
    static get SOUND() { return SOUND }

    /** 播放某一个声音：play/resume */
    static play(sound: SOUND) {
        if (!MSound.get_sound_switch()) { return }
        MSound.ins.array_sound_info[sound].play()
    }

    /** 停止某一个声音：stop/pause */
    static stop(sound: SOUND) {
        MSound.ins.array_sound_info[sound].stop()
    }

    /** 暂停所有声音（现有），主要用于关闭声音，引导界面等 */
    static pause_all() {
        cc.audioEngine.pauseAll()
    }

    /** 继续所有声音 */
    static resume_all() {
        cc.audioEngine.resumeAll()
    }

    /** 一个简化的通用方法：播放按钮声音 */
    static play_btn() {
        MSound.play(SOUND.test_effect)
    }

}

/** 声音控制器类 */
class ControllerSound {

    constructor(url: string, type: TYPE, volume: number, audio_clip: cc.AudioClip = undefined, id: number = undefined) {
        this.url = url
        this.type = type
        this.volume = volume
        this.audio_clip = audio_clip
        this.id = id
    }

    /** 对应的资源url */
    url: string
    /** 声音类型 */
    type: TYPE
    /** 声音音量大小 */
    volume: number
    /** 声音的cc.AudioClip资源 */
    audio_clip: cc.AudioClip
    /** 如果声音播放了，其id */
    id: number

    /** 播放 */
    async play() {
        if (this.audio_clip === undefined) {
            this.audio_clip = await MRes.load_res(`${C.PATH}/${this.url}`, cc.AudioClip)
        }
        if (this.type === TYPE.MUSIC) {
            if (this.id === undefined) {
                this.id = cc.audioEngine.play(this.audio_clip, true, this.volume)
            } else {
                cc.audioEngine.resume(this.id)
            }
        } else {
            cc.audioEngine.play(this.audio_clip, false, this.volume)
        }
    }

    /** 停止 */
    stop() {
        if (this.type === TYPE.MUSIC) {
            if (this.id === undefined) { return }
            cc.audioEngine.pause(this.id)
        } else {
            // 
        }
    }
}