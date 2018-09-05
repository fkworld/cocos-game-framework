import L from "./L";

const { ccclass, property } = cc._decorator
const C = {
    /** audio所在的path */
    AUDIO_PATH: 'audio',
}
Object.freeze(C)

/**
 * 框架文件：音频管理类
 * - 封装调用的方法
 * - 【注意】AudioClip与Prefab不同，由于引擎原因（个人觉得是bug），载入的是一串字符串url，因此不适合统一载入
 */
@ccclass
export default class MAudio extends cc.Component {

    /** @type {MAudio} */
    static ins

    onLoad() {
        MAudio.ins = this
    }

    /** 
     * 更改sound
     * - 直接更改本地数据L.sound
     * - 额外处理需要根据L.sound进行处理
     */
    change_sound() {
        if (L.sound === 'true') {
            L.sound = false
        } else {
            L.sound = true
        }
    }

    /** 
     * 更改music
     * - 直接更改本地数据L.music
     * - 额外处理需要根据L.music进行处理
     */
    change_music() {
        if (L.music === 'true') {
            L.music = false
        } else {
            L.music = true
        }
    }

    /**
     * 播放音效，类型为sound
     * @param {string} name 
     */
    play_sound(name) {
        if (L.sound === 'true') {
            this.play_audio(name)
        }
    }

    /**
     * 播放音效：类型为music
     * @param {string} name 
     */
    play_music(name) {
        if (L.music === 'true') {
            this.play_audio(name)
        }
    }

    /**
     * 直接播放音效
     * @param {string} name
     */
    play_audio(name) {
        cc.audioEngine.stopAll()
        cc.loader.loadRes(C.AUDIO_PATH + '/' + name, cc.AudioClip, (err, audio) => {
            if (err) {
                cc.error('载入audio资源失败，audio_name=', name, 'error=', err)
                return
            }
            cc.loader.setAutoRelease(audio, true)
            cc.audioEngine.play(audio, false)
        })
    }
}