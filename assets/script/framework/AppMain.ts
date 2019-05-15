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
 * - 显式调用调整屏幕适配,子系统初始化,界面变动
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
        const screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height
        const design_size = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height
        const f = screen_size >= design_size
        cc.Canvas.instance.fitHeight = f
        cc.Canvas.instance.fitWidth = !f
        cc.Canvas.instance["alignWithScreen"]() // 注意本方法不在文档中,下版本会修复,在fitHeight/fitWidth修改时自动调用
    }

    /** 初始化本地数据 */
    private init_local_data() {
        // 预处理
        L.init = MVersion.version_dev ? false : L.init
        if (L.init) { return }
        MLog.warn(`@AppMain: ${L.init ? "get user local data" : "not get user local data, init now..."}`)
        // 子系统初始化
        MSound.init_local()
        Mi18n.init_local()
        // 初始化完毕之后,置is_init为true
        L.init = true
    }
}