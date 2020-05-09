/**
 * 声音模块
 * - 使用key-value形式配置，value表示路径，value包含###前缀则表示music，否则表示sound
 */
export declare namespace FAudio {
    /** 事件，打开音乐开关 */
    const EVENT_OPEN_MUSIC_SWITCH = "@FAudio/open_music_switch";
    /** 声音配置 */
    interface ConfigAudio {
        [k: string]: string;
    }
    /**
     * 初始化
     * @param config
     */
    const init: (config: ConfigAudio) => void;
    /** 获取音乐开关 */
    const get_music_switch: () => boolean;
    /** 反向音乐开关 */
    const reverse_music: () => void;
    /** 获取音效开关 */
    const get_sound_switch: () => boolean;
    /** 反向音乐开关 */
    const reverse_sound: () => void;
    /** 播放一个声音 */
    const play: (key: string) => Promise<void>;
    /** 停止某一个声音 */
    const stop: (key: string) => Promise<void>;
}
