import L from "./L";

const C = {
    /** audio所在的path */
    AUDIO_PATH: 'audio',
}
Object.freeze(C)

/**
 * [framework-M] 音频管理类
 * - 封装调用的方法
 * - 【注意】AudioClip与Prefab不同，由于引擎原因（个人觉得是bug），载入的是一串字符串url，因此不适合统一载入
 * - 由于使用cc.loader.loadRes()方法单一载入，不需要等待全部载入完毕，因此可以写成非ccclass，使用静态方法做调用
 */
export default class MAudio {

    /**
     * 更改sound
     * - 需要根据本地存储L.sound进行处理
     * @static
     */
    static change_sound() {
        L.sound = !(L.sound === 'true')
    }

    /** 
     * 更改music
     * - 需要根据本地存储L.music进行处理
     * @static
     */
    static change_music() {
        L.music = !(L.music === 'true')
    }

    /**
     * 播放sound类型的音效
     * @param name 
     * @static
     */
    static play_sound(name: string) {
        if (L.sound === 'true') {
            MAudio.play_audio(name)
        }
    }

    /**
     * 播放music类型的音效
     * @param name 
     * @static
     */
    static play_music(name: string) {
        if (L.music === 'true') {
            MAudio.play_audio(name)
        }
    }

    /**
     * 载入并播放音效
     * - 是否在播放前需要stopAll()还需要再考虑；目前stop
     * @param name 
     * @static
     */
    static play_audio(name: string) {
        cc.audioEngine.stopAll()
        cc.loader.loadRes(C.AUDIO_PATH + '/' + name, cc.AudioClip, (err, audio) => {
            if (err) {
                cc.error('载入audio资源失败，audio_name=', name, 'error=', err)
                return
            }
            cc.loader.setAutoRelease(audio, true)
            cc.audioEngine.play(audio, false, 1)
        })
    }
}