import { L } from "./L";
import { G } from "./G";
import { MRes } from "./MRes";
import { MPanel } from "./MPanel";
import { MSound } from "./MSound";
import { Mi18n } from "./Mi18n";
import { PanelTest } from "../panel/PanelTest";
import { PanelLoading } from "../panel/PanelLoading";

const { ccclass, property } = cc._decorator
/** 版本区分：开发者版本，测试版本，正式版本 */
enum VERSION { dev, beta, rc }
const C = {
    VERSION: VERSION.dev,   // 当前版本
    WAIT_TIME: 1,           // 载入完毕后在loading页面的停留时间
}

/**
 * [framework] 游戏启动主入口
 * - 显式调用调整屏幕适配，本地存储初始化、游戏资源的初始化、声音初始化、界面初始化
 */
@ccclass
export class AppMain extends cc.Component {

    /** 判断当前的打开模式是否为dev模式 */
    static IS_VERSION_DEV() { return C.VERSION === VERSION.dev }

    start() {
        this.adjust_screen()
        this.init_local_data()
        // panel系统初始化，加载loading页面
        MPanel.init(this.panel_parent)
        PanelLoading.open().then(() => { this.check_load_finish() })
        // 各系统初始化
        MSound.init()
        MRes.init().then(() => { this.check_load_finish() })
    }

    @property({ tooltip: 'panel所挂载的父节点', type: cc.Node })
    panel_parent: cc.Node = null

    load_count = 0      // 载入流程计数
    max_load_count = 2  // 载入完毕计数（根据游戏的不同自行修改）

    /**
     * 检查载入计数，执行载入完毕逻辑
     * - 每次调用时载入计数+1，载入计数满足条件后进入游戏逻辑
     */
    async check_load_finish() {
        this.load_count += 1
        if (this.load_count < this.max_load_count) { return }
        // 载入完毕，进入游戏逻辑
        await G.wait_time(C.WAIT_TIME)
        await PanelLoading.close()
        PanelTest.open()
    }

    /** 调整屏幕适配 */
    adjust_screen() {
        const screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height // 注意cc.winSize只有在适配后（修改fitHeight\fitWidth后）才能获取到正确的值,因此使用cc.getFrameSize()来获取初始的屏幕大小
        const design_size = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height
        const f = screen_size >= design_size
        cc.Canvas.instance.fitHeight = f
        cc.Canvas.instance.fitWidth = !f
        cc.Canvas.instance['alignWithScreen']() // 注意本方法不在文档中，下版本会修复，在fitHeight\fitWidth修改时自动调用
    }

    /** 初始化本地数据 */
    init_local_data() {
        // 根据版本对init进行预处理
        L.init = AppMain.IS_VERSION_DEV() ? false : L.init
        // 输出log
        cc.warn(`@${AppMain.name}: ${L.init ? 'get user local data' : 'not get user local data, init now...'}`)
        if (L.init) { return }

        //////////
        // 这里是各个项目的本地数据初始化过程
        //////////

        MSound.init_l()
        Mi18n.init_local()

        // 初始化完毕之后，置is_init为true
        L.init = true
    }
}