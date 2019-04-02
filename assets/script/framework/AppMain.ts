import { PanelLoading } from "../panel/PanelLoading";
import { PanelTest } from "../panel/PanelTest";
import { G } from "./G";
import { L } from "./L";
import { Mi18n } from "./Mi18n";
import { MLog } from "./MLog";
import { MPanel } from "./MPanel";
import { MSound } from "./MSound";
import { MVersion } from "./MVersion";

const { ccclass, property, menu } = cc._decorator
const C = {
    // 游戏信息
    GAME_NAME: 'cocos-game-framework',
    GAME_VERSION_NUMBER: '0.0',
    GAME_CREATOR: 'skyfox-fengyong',
    WAIT_TIME: 1,   // 载入完毕后在loading页面的停留时间
}

/**
 * [framework] 游戏启动主入口
 * - 显式调用调整屏幕适配，本地存储初始化、游戏资源的初始化、声音初始化、界面初始化
 */
@ccclass
@menu("framework/AppMain")
export class AppMain extends cc.Component {

    start() {
        this.log_game_infomation()
        this.adjust_screen()
        this.init_local_data()
        // panel系统初始化，加载loading页面
        MPanel.init(this.panel_parent)
        PanelLoading.open().then(() => { this.check_load_finish() })
        // 各系统初始化
        MSound.init()
    }

    @property({ tooltip: 'panel所挂载的父节点', type: cc.Node })
    private panel_parent: cc.Node = null

    private load_count = 0      // 载入流程计数
    private max_load_count = 1  // 载入完毕计数（根据游戏的不同自行修改）

    /**
     * 检查载入计数，执行载入完毕逻辑
     * - 每次调用时载入计数+1，载入计数满足条件后进入游戏逻辑
     */
    private async check_load_finish() {
        this.load_count += 1
        if (this.load_count < this.max_load_count) { return }
        // 载入完毕，进入游戏逻辑
        await G.wait_time(C.WAIT_TIME)
        await PanelLoading.close()
        PanelTest.open()
        // PanelMessage.open('msg')
    }

    /** 打印游戏信息 */
    private log_game_infomation() {
        MLog.log('@game-info:', C.GAME_NAME, C.GAME_VERSION_NUMBER, C.GAME_CREATOR)
    }

    /** 调整屏幕适配 */
    private adjust_screen() {
        // 注意cc.winSize只有在适配后（修改fitHeight\fitWidth后）才能获取到正确的值,因此使用cc.getFrameSize()来获取初始的屏幕大小
        const screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height
        const design_size = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height
        const f = screen_size >= design_size
        cc.Canvas.instance.fitHeight = f
        cc.Canvas.instance.fitWidth = !f
        cc.Canvas.instance['alignWithScreen']() // 注意本方法不在文档中，下版本会修复，在fitHeight\fitWidth修改时自动调用
    }

    /** 初始化本地数据 */
    private init_local_data() {
        // 根据版本对init进行预处理
        L.init = MVersion.version_dev ? false : L.init
        // 输出log
        MLog.warn(`@${AppMain.name}: ${L.init ? 'get user local data' : 'not get user local data, init now...'}`)
        if (L.init) { return }

        //////////
        // 这里是各个项目的本地数据初始化过程
        //////////

        MSound.init_local()
        Mi18n.init_local()

        // 初始化完毕之后，置is_init为true
        L.init = true
    }
}