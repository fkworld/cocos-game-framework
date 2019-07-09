const { ccclass, menu } = cc._decorator;

/** 游戏状态 */
type TypeGameState = "start" | "pause" | "end";

/**
 * [framework] 游戏主控逻辑
 */
@ccclass
@menu("f/Gameplay")
export class Gameplay extends cc.Component {

    static ins: Gameplay;

    onLoad() {
        Gameplay.ins = this
    }

    start() {

    }

    /** 游戏状态;初始化状态为end */
    private game_state: TypeGameState = "end"

    /** 游戏初始化;包括各个游戏内子系统的初始化 */
    game_init() {

    }

    /** 游戏开始运行 */
    game_start() {
        this.game_state = "start"
    }

    /** 游戏暂停 */
    game_pause() {
        this.game_state = "pause"
    }

    /** 游戏继续 */
    game_resume() {
        this.game_state = "start"
    }
}