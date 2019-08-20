import { PanelGame } from "../panel/PanelGame";
import { PanelLoading } from "../panel/PanelLoading";
import { PanelWait } from "../panel/PanelWait";
import { FLocal } from "./FLocal";
import { FLog } from "./FLog";
import { FPanel } from "./FPanel";
import { FSound } from "./FSound";
import { FVersion } from "./FVersion";

const { ccclass, property, menu } = cc._decorator

/**
 * [framework] 游戏启动主入口
 * - 显式调用调整屏幕适配,本地存储初始化,游戏资源的初始化,声音初始化,界面初始化
 */
@ccclass
@menu("f/App")
export class App extends cc.Component {

    start() {
        this.app_start()
    }

    @property({ tooltip: "panel所挂载的父节点", type: cc.Node })
    private panel_parent: cc.Node = null

    /** app启动逻辑 */
    private async app_start() {
        // 打印游戏信息
        FLog.log("@game-info:", FVersion.get_name(), FVersion.get_creator(), FVersion.get_version_string(), FVersion.get_version_number(), FVersion.get_version_time())
        // 屏幕设配
        this.adjust_screen()
        // 各子系统初始化
        FLocal.init_local_data()
        FPanel.init_parent(this.panel_parent)
        FSound.play_bgm()
        // 加载loading页面,加载n个载入流程,加载完毕后进入游戏
        FPanel.load(PanelWait)
        await FPanel.open(PanelLoading, {})
        await FPanel.close(PanelLoading, {})
        await FPanel.open(PanelGame, {})
    }

    /** 调整屏幕适配 */
    private adjust_screen() {
        // 注意cc.winSize只有在适配后(修改fitHeight/fitWidth后)才能获取到正确的值,因此使用cc.getFrameSize()来获取初始的屏幕大小
        let screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height
        let design_size = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height
        let f = screen_size >= design_size
        cc.Canvas.instance.fitHeight = f
        cc.Canvas.instance.fitWidth = !f
    }
}
