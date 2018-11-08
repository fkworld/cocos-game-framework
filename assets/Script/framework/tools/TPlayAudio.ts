import MAudio from "../MAudio";

const { ccclass, property } = cc._decorator
/** 触发类型 */
enum TYPE_TRIGGER {
    on_click,
    on_press,
    on_drag,
}
/** 音效类型 */
enum TYPE_AUDIO {
    none,
    test,
}
const C = {
    TRIGGER: TYPE_TRIGGER,
    AUDIO: TYPE_AUDIO,
    TOOLIP: {
        TRIGGER: '触发类型：点击click触发，触摸touch触发，拖拽touchmove触发',
        AUDIO: '音频类型',
    },
}
Object.freeze(C)

/**
 * [framework-T] 显式触发音效
 */
@ccclass
export default class TPlayAudio extends cc.Component {

    onLoad() {
        this.set_event()
    }

    /** 触发类型 */
    @property({ tooltip: C.TOOLIP.TRIGGER, type: cc.Enum(C.TRIGGER) })
    trigger: TYPE_TRIGGER = C.TRIGGER.on_click

    /** 音频类型 */
    @property({ tooltip: C.TOOLIP.AUDIO, type: cc.Enum(C.AUDIO) })
    audio: TYPE_AUDIO = C.AUDIO.none

    /** 根据触摸类型设置点击事件 */
    set_event() {
        switch (this.trigger) {
            // onClick事件，对应TOUCH_END
            case C.TRIGGER.on_click:
                this.node.on(cc.Node.EventType.TOUCH_END, () => { this.play_sound() })
                break;
            // onPress事件，对应TOUCH_START
            case C.TRIGGER.on_press:
                this.node.on(cc.Node.EventType.TOUCH_START, () => { this.play_sound() })
                break;
            // onDrag事件，对应TOUCH_MOVE
            case C.TRIGGER.on_drag:
                this.node.on(cc.Node.EventType.TOUCH_MOVE, () => { this.play_sound() })
                break;
            default:
                break;
        }
    }

    /**
     * 播放音频
     * @param is_able_to_play 是否允许播放
     */
    play_sound(is_able_to_play: boolean = this.check_able_to_clike(), name: string = this.get_audio_name(this.audio)) {
        if (!is_able_to_play) { return }
        if (name === null) { return }
        MAudio.play_sound(name)
    }

    /**
     * 检查是否可以被点击；true表示可以被点击
     * - 仅当其有Button组件并且interactable为false时不可点击
     * @param node 当前node
     */
    check_able_to_clike(node = this.node): boolean {
        return !node.getComponent(cc.Button) || node.getComponent(cc.Button).interactable
    }

    /**
     * 获取播放音频的name
     * - 如果获取不到则返回null
     * @param audio_type 音频类型
     */
    get_audio_name(audio_type: TYPE_AUDIO): string | null {
        switch (audio_type) {
            case C.AUDIO.test: return 'test'
            default: return null
        }
    }
}