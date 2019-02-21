import { L } from "./L";
import { G } from "./G";
import { MRes } from "./MRes";
import { MPanel } from "./MPanel";
import { MSound } from "./MSound";
import { Mi18n } from "./Mi18n";
import { PanelBase } from "../panel/PanelBase";
import { PanelTest } from "../panel/PanelTest";

const { ccclass, property } = cc._decorator
/** 版本区分：开发者版本，测试版本，正式版本 */
enum VERSION { dev, beta, rc }
const C = {
    VERSION: VERSION.dev,
    WAIT_TIME: 1,
    FADE_TIME: 1,
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
        // 各系统初始化
        MSound.init()
        MPanel.init(this.panel_parent)
        MRes.init().then(() => { this.check_load_finish() })
    }

    @property({ tooltip: '游戏主Canvas', type: cc.Canvas })
    canvas: cc.Canvas = null

    @property({ tooltip: '游戏loading界面', type: cc.Node })
    panel_loading: cc.Node = null

    @property({ tooltip: 'panel所挂载的父节点', type: cc.Node })
    panel_parent: cc.Node = null

    /** 载入完毕计数 */
    load_count = 0
    /** 载入完毕总计数 */
    max_load_count = 1

    /**
     * 检查载入计数，执行载入完毕逻辑
     * - 目前只有1个计数：资源载入完毕
     */
    async check_load_finish() {
        this.load_count += 1
        if (this.load_count < this.max_load_count) { return }
        // 进入游戏
        await G.wait_time(C.WAIT_TIME)
        await MPanel.out_fade(this.panel_loading, C.FADE_TIME)
        this.panel_loading.active = false
        MPanel.open(`${PanelTest.name}`)
    }

    /** 初始化本地数据 */
    init_local_data() {
        // 根据版本对init进行预处理
        L.init = AppMain.IS_VERSION_DEV() ? false : L.init
        // 输出log
        if (L.init) {
            cc.warn(`[${AppMain.name}] get user\'s local data`)
            return
        } else {
            cc.warn(`[${AppMain.name}] unget user\'s local data, init now...`)
        }

        //////////
        // 这里是各个项目的本地数据初始化过程
        //////////

        MSound.init_l()
        Mi18n.init_local()

        // 初始化完毕之后，置is_init为true
        L.init = true
    }

    /** 调整屏幕适配 */
    adjust_screen() {
        // 注意cc.winSize只有在适配后（修改fitHeight\fitWidth后）才能获取到正确的值
        // 因此使用cc.getFrameSize()来获取初始的屏幕大小
        const f = cc.view.getFrameSize().width / cc.view.getFrameSize().height >= this.canvas.designResolution.width / this.canvas.designResolution.height
        this.canvas.fitHeight = f
        this.canvas.fitWidth = !f
        // 注意本方法不在文档中，但是需要应用
        // 在下一个creator版本中有修复，会在fitHeight\fitWidth修改时自动调用
        this.canvas['alignWithScreen']()
    }
}