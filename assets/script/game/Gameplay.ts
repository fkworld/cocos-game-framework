const { ccclass } = cc._decorator;

/** 游戏状态 */
type GameState =
    | "init"    // 游戏初始化
    | "start"   // 游戏开始
    | "end"     // 游戏结束

/**
 * 游戏主逻辑
 */
@ccclass
export class Gameplay extends cc.Component {

    static ins: Gameplay;

    onLoad() {
        Gameplay.ins = this
    }

    /** 游戏状态 */
    state = new fy.SFSM<GameState>({
        id: "GameplayState",
        initial: "init",
        states: {
            "init": ["start"],
            "start": ["end"],
            "end": ["start"],
        },
    })

    /** 游戏初始化。包括各个游戏内子系统的初始化 */
    game_init() {

    }

    /** 游戏开始运行 */
    game_start() {
        if (!this.state.try_go_state("start")) { return }
    }

    /** 游戏结束 */
    game_end() {
        if (!this.state.try_go_state("end")) { return }
    }
}
