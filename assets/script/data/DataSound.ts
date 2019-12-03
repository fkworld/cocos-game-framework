/** 所有声音的key */
export type DataSoundKey = keyof typeof DataSound

/** 所有声音的value类型，分别为：文件路径，音量大小（0-1），是否循环播放 */
export type DataSoundValue = [string, number?, boolean?]

/** 所有声音的数据 */
export const DataSound = {

    "bgm": ["test", 1, true],

    "btn": ["test"]
}
