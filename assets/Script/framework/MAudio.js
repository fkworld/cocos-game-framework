import L from "./L";

const { ccclass, property } = cc._decorator

/**
 * 框架文件：音频管理类
 * - 封装调用的方法
 */
@ccclass
export default class MAudio extends cc.Component {

    /** @type {MAudio} */
    static ins

    onLoad() {
        /** @type {Object<cc.AudioClip>} audio存储 */
        this.object_audio = {}

        MAudio.ins = this
    }

    /** 数据转换（由于需要等待音频资源载入完成，因此不直接调用，而在AppMain中调用） */
    trans_array_to_object() {
        for (let audio of MRes.ins.array_audio) {
            this.object_audio[audio.name] = audio
        }
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
        // 检查
        if (!this.check_name(name)) { return }
        // 播放
        cc.audioEngine.stopAll()
        cc.audioEngine.play(this.object_audio[name])
    }

    /**
     * 检查名称是否存在
     * @param {string} name 
     * @returns {boolean}
     */
    check_name(name) {
        let audio = this.object_audio[name]
        if (audio === undefined) {
            cc.error("需要播放的audio不存在，audio_name=", name)
            return false
        }
        return true
    }

}