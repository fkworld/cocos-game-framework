import { FState } from "../framework/FState";

const { ccclass, menu } = cc._decorator;

/**
 * 游戏状态
 * - init 初始化
 * - start 开始
 * - pause 暂停
 * - end 结束
 */
type GameState = "init" | "start" | "pause" | "end"

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
    private state = new FState.StateJumpTable<GameState>({
        "init": ["start"],
        "start": ["end", "pause"],
        "pause": ["start"],
        "end": ["start"],
    }, "init")

    /** 获取当前的游戏状态 */
    get_state() { return this.state }

    /** 游戏初始化;包括各个游戏内子系统的初始化 */
    game_init() {

    }

    /** 游戏开始运行 */
    game_start() {
        if (!this.state.try_change_state("start")) { return }
    }

    /** 游戏暂停 */
    game_pause() {
        if (!this.state.try_change_state("pause")) { return }
    }

    /** 游戏继续 */
    game_resume() {
        if (!this.state.try_change_state("start")) { return }
    }

    /** 游戏结束 */
    game_end() {
        if (!this.state.try_change_state("end")) { return }
    }
}
