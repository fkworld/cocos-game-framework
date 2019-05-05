import { G } from "./G";
import { L } from "./L";
import { MLog } from "./MLog";

interface ISound {
    url: string,            // 声音的资源字符串
    loop?: boolean,         // 是否循环播放,是否为bgm,默认为false
    volume?: number,        // 音量,默认为1
    clip?: cc.AudioClip,    // 声音的cc.AudioClip资源,默认为null
    id?: number,            // 声音的播放id,默认为null
}
const C = {
    PATH: 'sound',          // 资源路径
    DEFAULT_SWITCH: true,   // 默认开关
    SOUND: {                // 声音类型以及其对应的url
        "bgm-test": "test",
        "btn": "test",
    },
}

/**
 * [M] 声音管理
 * - 保存已经载入的声音,cc.AudioClip
 * - 保存已经播放的声音id
 */
export class MSound {

    /** 初始化本地存储 */
    static init_local() { L.sound = C.DEFAULT_SWITCH }

    static ins: MSound

    /** 初始化 */
    static init() {
        G.check_ins(MSound)
        MSound.ins = new MSound()
        MSound.ins.init_data()
    }

    /** 与SOUND一一对应的具体声音信息 */
    private obj_sound_info: { [key in keyof typeof C.SOUND]?: ISound } = {}

    /** 初始化声音数据 */
    private init_data() {
        this.obj_sound_info["bgm-test"] = { url: C.SOUND["bgm-test"], loop: true }
        this.obj_sound_info["btn"] = { url: C.SOUND["btn"] }
        // check-length
        if (Object.keys(C.SOUND).length != Object.keys(this.obj_sound_info).length) {
            MLog.warn("sound初始化个数异常")
        }
    }

    /** 设置声音开关(直接反向) */
    static set_sound_switch() {
        L.sound = !L.sound
        if (L.sound) {
            MSound.resume_all()
        } else {
            MSound.pause_all()
        }
    }

    /** 播放某一个声音:play/resume */
    static async play(sound: keyof typeof C.SOUND) {
        if (!L.sound) { return }
        let info: ISound = MSound.ins.obj_sound_info[sound]
        // 载入audio clip资源
        if (!info.clip) { info.clip = await G.load_res(`${C.PATH}/${info.url}`, cc.AudioClip) }
        if (!info.clip) { MLog.error(`@MSound: a not exsit audio clip, url=${info.url}`); return }
        if (info.loop) {
            // bgm类型,循环播放,只需要播放1次即可
            switch (cc.audioEngine.getState(info.id)) {
                case cc.audioEngine.AudioState.ERROR: case cc.audioEngine.AudioState.STOPPED:
                    MSound.ins.obj_sound_info[sound].id = cc.audioEngine.play(info.clip, info.loop, info.volume)
                    break;
                case cc.audioEngine.AudioState.PAUSED:
                    cc.audioEngine.resume(info.id)
                    break;
                default: case cc.audioEngine.AudioState.INITIALZING: case cc.audioEngine.AudioState.PLAYING:
                    break;
            }
        } else {
            // 普通音效类型,重复播放,相互独立
            MSound.ins.obj_sound_info[sound].id = cc.audioEngine.play(info.clip, info.loop, info.volume)
        }
    }

    /** 停止某一个声音:stop/pause */
    static stop(sound: keyof typeof C.SOUND) {
        let info: ISound = MSound.ins.obj_sound_info[sound]
        if (info.loop) {
            // bgm类型,pause
            cc.audioEngine.pause(info.id)
        } else {
            // 普通音效类型,stop
            cc.audioEngine.stop(info.id)
        }
    }

    /** 暂停所有声音(现有),主要用于关闭声音,引导界面等 */
    static pause_all() {
        cc.audioEngine.pauseAll()
    }

    /** 继续所有声音 */
    static resume_all() {
        cc.audioEngine.resumeAll()
    }

    // 常用声音

    static play_bgm() {
        MSound.play("bgm-test")
    }

    /** 常用的声音:按钮 */
    static play_btn() {
        MSound.play("btn")
    }

}