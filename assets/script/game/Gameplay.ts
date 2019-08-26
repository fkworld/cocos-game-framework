const { ccclass, menu } = cc._decorator;

/** 游戏状态 */
type TypeGameState = "init" | "start" | "pause" | "end";

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

    /** 游戏状态 */
    private state: TypeGameState = "init"

    /** 游戏状态判定 */
    is_state(...state_list: TypeGameState[]) {
        return state_list.includes(this.state)
    }

    /** 游戏初始化;包括各个游戏内子系统的初始化 */
    game_init() {
        this.state = "init"
    }

    /** 游戏开始运行 */
    game_start() {
        this.state = "start"
    }

    /** 游戏暂停 */
    game_pause() {
        this.state = "pause"
    }

    /** 游戏继续 */
    game_resume() {
        this.state = "start"
    }
}
