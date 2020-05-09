import { DataAudio } from "../config/DataAudio";
import { DataColor } from "../config/DataColor";
import { DataLocal } from "../config/DataLocal";
import { DataLanguage } from "../config/DataText";
import { DataVersion, DataVersionInfo } from "../config/DataVersion";
import { PanelExample } from "../panel/PanelExample";

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
        // loading动画
        // this.loading_show()
        // 各子系统初始化
        fy.FVersion.init(DataVersion, DataVersionInfo)
        fy.FLocal.init(DataLocal)
        fy.FAudio.init(DataAudio)
        fy.FText.init(DataLanguage)
        fy.FColor.init(DataColor)
        fy.FPanel.init(this.panel_parent)
        await Promise.all([
            fy.FMeta.init_async("game-config-csv-all.json")
        ])
        // 游戏启动逻辑
        fy.FPanel.open(PanelExample)
        // 载入完毕，关闭loading页面
        // this.loading_hide()
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

    @property(cc.Node)
    private panel_loading: cc.Node = null

    @property(cc.ProgressBar)
    private pb_progress: cc.ProgressBar = null
    private PROGRESS_TWEEN_TAG = 1024

    @property(cc.Label)
    private label_progress: cc.Label = null

    private loading_show() {
        this.pb_progress.progress = 0
        this.label_progress.string = "0%"
        cc.tween(this.pb_progress)
            .tag(this.PROGRESS_TWEEN_TAG)
            .set({ progress: 0 })
            .to(0.5, { progress: _.random(0.3, 0.6) })
            .delay(0.2)
            .to(0.5, { progress: _.random(0.7, 0.9) })
            .delay(0.2)
            .to(0.5, { progress: 0.98 })
            .start()
    }

    private loading_hide() {
        cc.Tween.stopAllByTag(this.PROGRESS_TWEEN_TAG)
        this.pb_progress.progress = 1
        this.label_progress.string = "100%"
        cc.tween(this.panel_loading)
            .delay(0.2)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.panel_loading.active = false
            })
            .start()
    }
}
