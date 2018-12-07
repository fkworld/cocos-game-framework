import { L } from "./L";
import { G } from "./G";
import { MRes } from "./MRes";
import { MLanguage } from "./tools/i18n/MLanguage";
import { MPanel } from "./MPanel";
import { TPlaySound } from "./tools/TPlaySound";

const { ccclass, property } = cc._decorator
const C = {
    /** 伪帧数之内进度条读满 */
    FAKE_FRAME: 100,
    /** 进度条满之后的等待时间 */
    FAKE_DELAY: 0.5,
    /** loading界面渐隐时间 */
    LAODING_FADE_TIME: 2,
}
Object.freeze(C)

/**
 * [framework] 游戏启动主入口
 * - 显式调用游戏资源的初始化过程
 * - 显示调用本次存储的初始化过程
 * - 调整屏幕适配方案
 * - Loading界面的相关逻辑
 */
@ccclass
class AppMain extends cc.Component {

    onLoad() {
        this.adjust_screen()
    }

    start() {
        this.init_local_data()
        MRes.ins.load_chain().then(() => { this.check_load_finish() })
        this.pb.progress = 0
        G.run_by_each_frame(() => {
            this.pb.progress += 1 / C.FAKE_FRAME
            if (this.pb.progress >= 1) { this.check_load_finish() }
        }, this, C.FAKE_FRAME)
    }

    load_count = 0
    max_load_count = 2

    /**
     * 检查载入计数，执行载入完毕逻辑
     * - 目前有两个计数：MRes的资源载入完毕；进度条载入完毕
     */
    async check_load_finish(max: number = this.max_load_count) {
        this.load_count += 1
        if (this.load_count < max) { return }
        await G.wait_time(C.FAKE_DELAY)
        await MPanel.out_fade(this.panel_loading, C.LAODING_FADE_TIME, cc.easeExponentialIn())
        this.panel_loading.active = false
        MPanel.open('PanelTest')
    }

    /** 游戏主Canvas */
    @property(cc.Canvas)
    canvas: cc.Canvas = null

    /** 游戏Loading界面 */
    @property(cc.Node)
    panel_loading: cc.Node = null

    /** 游戏Loading界面进度条 */
    @property(cc.ProgressBar)
    pb: cc.ProgressBar = null

    /** 初始化本地数据 */
    init_local_data() {
        // 测试阶段每次打开时均需要初始化，正是上线后注释掉
        L.is_init = false
        // 输出log
        if (L.is_init === 'true') { cc.warn('get user\'s local data'); return }
        else { cc.warn('unget user\'s local data, init now...') }

        //////////
        // 这里是各个项目的本地数据初始化过程
        //////////

        TPlaySound.init_l()
        MLanguage.init_l()

        // 初始化完毕之后，置is_init为true
        L.is_init = true
    }

    /** 调整屏幕适配 */
    adjust_screen() {
        let f = cc.winSize.width / cc.winSize.height > this.canvas.designResolution.width / this.canvas.designResolution.height
        this.canvas.fitHeight = !f
        this.canvas.fitWidth = f
        this.canvas.alignWithScreen() // 注意本方法不在文档中，但是需要应用
    }
}