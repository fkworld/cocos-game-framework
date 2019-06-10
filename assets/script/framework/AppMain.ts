import { PanelGame } from "../panel/PanelGame";
import { PanelLoading } from "../panel/PanelLoading";
import { L } from "./L";
import { Mi18n } from "./Mi18n";
import { MLog } from "./MLog";
import { MPanel } from "./MPanel";
import { MSound } from "./MSound";
import { MVersion } from "./MVersion";

const { ccclass, property, menu } = cc._decorator

/**
 * [framework] 游戏启动主入口
 * - 显式调用调整屏幕适配,本地存储初始化,游戏资源的初始化,声音初始化,界面初始化
 */
@ccclass
@menu("framework/AppMain")
export class AppMain extends cc.Component {

    async start() {
        // 屏幕设配
        this.adjust_screen()
        // 打印游戏信息
        MLog.log("@game-info:", MVersion.NAME, MVersion.CREATOR, MVersion.VERSION_NUMBER, MVersion.VERSION)
        // 各子系统初始化
        this.init_local_data()
        MPanel.init(this.panel_parent)
        MSound.init()
        // 加载loading页面,加载n个载入流程,加载完毕后进入游戏
        await MPanel.open(PanelLoading, {})
        await MPanel.close(PanelLoading, {})
        await MPanel.open(PanelGame, {})
    }

    @property({ tooltip: "panel所挂载的父节点", type: cc.Node })
    private panel_parent: cc.Node = null

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
        if (MVersion.version_dev) { L.init = false }
        MLog.log(`@AppMain: ${L.init ? "已获取用户本地数据" : "未获取用户本地数据,正在初始化..."}`)
        if (L.init) { return }
        // 子系统初始化
        MSound.init_local()
        Mi18n.init_local()
        // 初始化完毕之后,置is_init为true
        L.init = true
    }
}