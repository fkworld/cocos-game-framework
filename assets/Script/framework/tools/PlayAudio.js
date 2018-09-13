import MAudio from "../MAudio";

const { ccclass, property } = cc._decorator
const C = {
    /** 触发类型 */
    TRIGGER: cc.Enum({
        OnClick: 0,
        OnPress: 1,
        OnDrag: 2,
    }),
    /** 音效类型 */
    AUDIO: cc.Enum({
        None: 0,
        Test: 1,
    }),
    TOOLIP: {
        TRIGGER: '触发类型：点击click触发，触摸touch触发，拖拽touchmove触发',
        AUDIO: '音频类型',
    },
}
Object.freeze(C)

/**
 * 【框架-工具】根据触发类型播放统一化音效
 */
@ccclass
export default class PlayAudio extends cc.Component {

    /** @typedef {C.TRIGGER} 触发类型 */
    @property({ tooltip: C.TOOLIP.TRIGGER, type: C.TRIGGER })
    trigger = C.TRIGGER.OnClick

    /** @typedef {C.AUDIO} 音频类型 */
    @property({ tooltip: C.TOOLIP.AUDIO, type: C.AUDIO })
    audio = C.AUDIO.None

    start() {
        this.set_event()
    }

    /** 根据触摸类型设置点击事件 */
    set_event() {
        switch (this.trigger) {
            // onClick事件，对应TOUCH_END
            case C.TRIGGER.OnClick:
                this.node.on(cc.Node.EventType.TOUCH_END, () => { this.play_sound() })
                break;
            // onPress事件，对应TOUCH_START
            case C.TRIGGER.OnPress:
                this.node.on(cc.Node.EventType.TOUCH_START, () => { this.play_sound() })
                break;
            // onDrag事件，对应TOUCH_MOVE
            case C.TRIGGER.OnDrag:
                this.node.on(cc.Node.EventType.TOUCH_MOVE, () => { this.play_sound() })
                break;
            default:
                break;
        }
    }

    /** 播放音频 */
    play_sound() {
        if (!this.check_able_to_clike()) { return }
        let name = this.get_audio_name(this.audio)
        if (name === null) { return }
        MAudio.play_sound(name)
    }

    /**
     * 检查是否可以被点击
     * - 仅当其有Button组件并且interactable为false时不可点击
     */
    check_able_to_clike() {
        if (this.node.getComponent(cc.Button) && !this.node.getComponent(cc.Button).interactable) {
            return false
        } else {
            return true
        }
    }

    /**
     * 获取播放的音频name
     * @param {number} audio_type 
     */
    get_audio_name(audio_type) {
        switch (audio_type) {
            case C.AUDIO.Test: return 'test'
            default: return null
        }
    }
}