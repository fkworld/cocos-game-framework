import L from "../L";
import MRes from "../MRes";

const { ccclass, property } = cc._decorator
/** 触发类型 */
enum TYPE_TRIGGER { touch_end, touch_start, touch_move }
/** 音效类型 */
enum TYPE_SOUND { none, test }
/** 音效对应的文件名 */
const SOUND_DATA = [null, 'test']
const C = {
    /** sound所在的path */
    PATH: 'sound',
    TOOLIP: {
        TRIGGER: '触发类型：点击click触发，触摸touch触发，拖拽touchmove触发',
        SOUND: '音频类型',
    },
}
Object.freeze(C)

/**
 * [framework-T] 显式触发音效，播放音效
 * @todo 保存已经load的音效资源来避免重复load
 */
@ccclass
export default class TPlaySound extends cc.Component {

    /** 初始化本地存储 */
    static init_l() {
        L.sound = true
    }

    /**
     * 播放音效
     * @param name 
     */
    static play_sound(name: string) {
        MRes.load_res(`${C.PATH}/${name}`, cc.AudioClip).then((v: cc.AudioClip) => {
            cc.loader.setAutoRelease(v, true)
            cc.audioEngine.play(v, false, 1)
        }).catch(() => {
            cc.error(`sound is not exist, name=${name}`)
        })
    }

    onLoad() {
        this.set_event()
    }

    /** 触发类型 */
    @property({ tooltip: C.TOOLIP.TRIGGER, type: cc.Enum(TYPE_TRIGGER) })
    trigger: TYPE_TRIGGER = TYPE_TRIGGER.touch_end

    /** 音频类型 */
    @property({ tooltip: C.TOOLIP.SOUND, type: cc.Enum(TYPE_SOUND) })
    sound: TYPE_SOUND = TYPE_SOUND.none

    /** 根据触摸类型设置点击事件 */
    set_event() {
        switch (this.trigger) {
            case TYPE_TRIGGER.touch_end:
                this.node.on(cc.Node.EventType.TOUCH_END, () => { this.play_sound() })
                break;
            case TYPE_TRIGGER.touch_start:
                this.node.on(cc.Node.EventType.TOUCH_START, () => { this.play_sound() })
                break;
            case TYPE_TRIGGER.touch_move:
                this.node.on(cc.Node.EventType.TOUCH_MOVE, () => { this.play_sound() })
                break;
            default:
                break;
        }
    }

    /** 播放音频 */
    play_sound(name = SOUND_DATA[this.sound], is_able_to_play = L.sound === 'true') {
        if (!is_able_to_play) { return }
        if (typeof name != 'string') { return }
        TPlaySound.play_sound(name)
    }
}