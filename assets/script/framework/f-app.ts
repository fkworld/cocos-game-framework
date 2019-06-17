import { PanelGame } from "../panel/panel-game";
import { PanelLoading } from "../panel/panel-loading";
import { L } from "./f-local";
import { FMI18n } from "./fm-i18n";
import { FMLog } from "./fm-log";
import { FMPanel } from "./fm-panel";
import { FMSound } from "./fm-sound";
import { FMVersion } from "./fm-version";

const { ccclass, property, menu } = cc._decorator

/**
 * [framework] 游戏启动主入口
 * - 显式调用调整屏幕适配,本地存储初始化,游戏资源的初始化,声音初始化,界面初始化
 */
@ccclass
@menu("framework/FApp")
export class FApp extends cc.Component {

    start() {
        this.app_start()
    }

    @property({ tooltip: "panel所挂载的父节点", type: cc.Node })
    private panel_parent: cc.Node = null

    /** app启动逻辑 */
    private async app_start() {
        // 打印游戏信息
        FMLog.log("@game-info:", FMVersion.NAME, FMVersion.CREATOR, FMVersion.VERSION_NUMBER, FMVersion.VERSION)
        // 屏幕设配
        this.adjust_screen()
        // 各子系统初始化
        this.init_local_data()
        FMPanel.init(this.panel_parent)
        FMSound.init()
        // 加载loading页面,加载n个载入流程,加载完毕后进入游戏
        await FMPanel.open(PanelLoading, {})
        await FMPanel.close(PanelLoading, {})
        await FMPanel.open(PanelGame, {})
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

    /** 初始化本地数据 */
    private init_local_data() {
        // 预处理
        if (FMVersion.version_dev) { L.init = false }
        FMLog.log(`@FApp: ${L.init ? "已获取用户本地数据" : "未获取用户本地数据,正在初始化..."}`)
        if (L.init) { return }
        // 子系统初始化
        FMSound.init_local()
        FMI18n.init_local()
        // 初始化完毕之后,置is_init为true
        L.init = true
    }
}