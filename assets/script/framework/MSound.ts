import { G } from "./G";
import { L } from "./L";
import { MLog } from "./MLog";

interface ISound {
    url: string,            // 声音的资源字符串
    volume: number,         // 音量
    loop: boolean,          // 是否循环播放，是否为bgm
    clip: cc.AudioClip,     // 声音的cc.AudioClip资源
    id: number,             // 声音的播放id
}
/** 声音具体区分名称 */
enum SOUND {
    test_bgm,               // 测试背景音乐
    test,                   // 测试音效
}
const C = {
    PATH: 'sound',          // 资源路径
    DEFAULT_SWITCH: true,   // 默认开关
}

/**
 * [M] 声音管理
 * - 保存已经载入的声音，cc.AudioClip
 * - 保存已经播放的声音id
 */
export class MSound {

    /** 声音的具体区分名称 */
    static get SOUND() { return SOUND }

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
    private array_sound_info: ISound[] = []

    /** 初始化声音数据 */
    private init_data() {
        this.array_sound_info[SOUND.test_bgm] = { url: 'test', volume: 1, loop: true, clip: null, id: null }
        this.array_sound_info[SOUND.test] = { url: 'test', volume: 1, loop: false, clip: null, id: null }
    }

    /** 设置声音开关（直接反向） */
    static set_sound_switch() {
        L.sound = !L.sound
        if (L.sound) {
            MSound.resume_all()
        } else {
            MSound.pause_all()
        }
    }

    /** 播放某一个声音：play/resume */
    static async play(sound: SOUND) {
        if (!L.sound) { return }
        let info: ISound = MSound.ins.array_sound_info[sound]
        // 载入audio clip资源
        if (!info.clip) { info.clip = await G.load_res(`${C.PATH}/${info.url}`, cc.AudioClip) }
        if (!info.clip) { MLog.error(`@${MSound.name}: a not exsit audio clip, url=${info.url}`); return }
        if (info.loop) {
            // bgm类型，循环播放，只需要播放1次即可
            switch (cc.audioEngine.getState(info.id)) {
                case cc.audioEngine.AudioState.ERROR: case cc.audioEngine.AudioState.STOPPED:
                    MSound.ins.array_sound_info[sound].id = cc.audioEngine.play(info.clip, info.loop, info.volume)
                    break;
                case cc.audioEngine.AudioState.PAUSED:
                    cc.audioEngine.resume(info.id)
                    break;
                default: case cc.audioEngine.AudioState.INITIALZING: case cc.audioEngine.AudioState.PLAYING:
                    break;
            }
        } else {
            // 普通音效类型，重复播放，相互独立
            MSound.ins.array_sound_info[sound].id = cc.audioEngine.play(info.clip, info.loop, info.volume)
        }
    }

    /** 停止某一个声音：stop/pause */
    static stop(sound: SOUND) {
        let info: ISound = MSound.ins.array_sound_info[sound]
        if (info.loop) {
            // bgm类型，pause
            cc.audioEngine.pause(info.id)
        } else {
            // 普通音效类型，stop
            cc.audioEngine.stop(info.id)
        }
    }

    /** 暂停所有声音（现有），主要用于关闭声音，引导界面等 */
    static pause_all() { cc.audioEngine.pauseAll() }

    /** 继续所有声音 */
    static resume_all() { cc.audioEngine.resumeAll() }

    // 常用声音

    /** 常用的声音：按钮 */
    static play_btn() { MSound.play(SOUND.test) }

}