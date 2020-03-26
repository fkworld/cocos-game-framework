import { FLocal } from "../framework/FLocal"
import { FPanel } from "../framework/FPanel"
import { FSound } from "../framework/FSound"
import { FVersion } from "../framework/FVersion"
import { FMeta } from "../framework/FMeta";

const { ccclass, property } = cc._decorator;

/**
 * 游戏启动主入口
 * - 需要挂在 Canvas 节点下。
 * - 显式调用调整屏幕适配，各子系统初始化，游戏启动逻辑等。
 */
@ccclass
export class App extends cc.Component {

    start() {
        this.start_app()
    }

    @property({ tooltip: "panel所挂载的父节点", type: cc.Node })
    private panel_parent: cc.Node = null

    /** app启动逻辑 */
    private async start_app() {
        // 屏幕适配
        this.adjust_screen()
        // 各子系统初始化
        FVersion.init()
        FLocal.init()
        FPanel.init(this.panel_parent)
        await Promise.all([
            FMeta.init_async()
        ])
        // 游戏启动逻辑
        FSound.play_bgm()
    }

    /**
     * 调整屏幕适配
     * - 注意 cc.winSize 只有在适配后才能获取到正确的值，因此需要使用 cc.getFrameSize() 来获取初始的屏幕大小。
     */
    private adjust_screen() {
        let screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height
        let design_size = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height
        let f = screen_size >= design_size
        cc.Canvas.instance.fitHeight = f
        cc.Canvas.instance.fitWidth = !f
    }
}
