export interface DataSound {
    url: string,            // 声音的资源字符串
    loop: boolean,          // 是否循环播放,是否为bgm,默认为false
    volume: number,         // 音量,默认为1
}

function set_data(url: string, loop = false, volume = 1): DataSound {
    return {
        url: url,
        loop: loop,
        volume: 1,
    }
}

/** 声音资源所在的路径 */
export const SOUND_PATH = "sound";

/** 声音资源对应的文件名,是否循环(默认为false),音量大小(默认为1) */
export const SOUND = {

    "bgm": set_data("test", true, 1),

    "btn": set_data("test")
}
