const { ccclass } = cc._decorator;

/**
 * [framework] 游戏主控逻辑
 */
@ccclass
export default class GamePlay extends cc.Component {

    static ins: GamePlay

    onLoad() {
        GamePlay.ins = this
    }

    start() {

    }

    /**
     * 游戏初始化
     * - 数据初始化
     * - 包括各子系统的初始化
     */
    game_init() { }

    /**
     * 游戏开始运行
     */
    game_start() { }

    /** 游戏是否处于暂停状态 */
    is_game_pause: boolean = false

    /**
     * 游戏暂停
     */
    game_pause() {
        this.is_game_pause = true
    }

    /**
     * 游戏继续
     */
    game_resume() {
        this.is_game_pause = false
    }
}