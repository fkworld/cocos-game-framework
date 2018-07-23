/**
 * @框架文件
 * @author fengyong
 * @version 2018-7-17
 */

const { ccclass, property } = cc._decorator

/**
 * 音频管理工具
 * - 载入音乐音效资源
 * - 封装调用方法
 */
@ccclass
export default class AudioManager extends cc.Component {

    /** 构造函数 */
    constructor() {
        super()
        /** 音频的所在path */
        this.audio_path = "audio"
        /** 音频字典 */
        this.audio_array = {}
    }

    onLoad() {
        AudioManager.instance = this
    }

    /** 音频总量 */
    set audio_all_count(count) {
        this._audio_all_count = count
    }

    get audio_all_count() {
        return this._audio_all_count
    }

    /** 音频载入量 */
    set audio_load_count(count) {
        this._audio_load_count = count
    }

    get audio_load_count() {
        return this._audio_load_count
    }

    /** 载入所有的Panel */
    load_all_audio() {
        cc.loader.loadResDir(
            // audio的path，注意必须要在asset/resource下
            this.audio_path,
            // 格式
            cc.AudioClip,
            // 每载入一个资源后的回调函数
            (completedCount, totalCount, item) => {
                this.audio_all_count = totalCount
                this.audio_load_count = completedCount
                this.audio_array[item] = item
                cc.log(this.audio_load_count)
            },
            // 载入全部资源后的回调函数
            (err, res) => {
                // 载入失败
                if (err) {
                    cc.error(this.name, "载入音频资源失败，err=", err)
                    return
                }
                // 载入成功
                cc.info(this.name, "载入音频资源成功")
            }
        )
    }
}

/** 单个音频 */
class Audio {
    constructor(clip, type) {

    }
}