import L from "./L";
import MRes from "./MRes";
import MPanel from "./MPanel";

const { ccclass, property } = cc._decorator
const C = {
    /** 假进度条的移动速度（每秒移动多少百分比） */
    FAKE_BAR_V: 1,
    /** 假进度条满了之后的延迟时间 */
    FAKE_BAR_DELAY: 0.5,
    /** loading界面渐隐时间 */
    LAODING_FADE_TIME: 0.5,
    /** 屏幕比例（竖屏） */
    SCREEN_RATIO: 1136 / 640,
}
Object.freeze(C)

/**
 * 【框架】游戏启动主入口
 * - 显式调用游戏资源的初始化过程
 * - 调整屏幕适配方案
 * - Loading界面的相关逻辑
 */
@ccclass
class AppMain extends cc.Component {

    /** @type {cc.Canvas} 游戏主Canvas */
    @property(cc.Canvas)
    canvas = null

    /** @type {cc.Node} 游戏Loading界面 */
    @property(cc.Node)
    panel_loading = null

    /** @type {cc.ProgressBar} 游戏Loading界面进度条 */
    @property(cc.ProgressBar)
    pb = null

    start() {
        this.adjust_screen()

        this.pb.progress = 0
        MRes.ins.load_chain().then(() => {
            // 1、初始化本地数据
            L.is_init = false
            this.inin_local_data()
            this.init_test_local_data()
            // 2、针对资源进行二次存储（修改存储结构）
            MPanel.ins.trans_array_to_object()
            // 3、关闭loading界面，显示游戏界面
            this.scheduleOnce(() => {
                // 定制渐隐效果
                this.panel_loading.runAction(cc.sequence(
                    cc.fadeOut(C.LAODING_FADE_TIME),
                    cc.callFunc(() => {
                        // 渐隐结束后调用主窗口
                        MPanel.ins.panel_open('PanelTest')
                    })
                ))
            }, C.FAKE_BAR_DELAY + 1 / C.FAKE_BAR_V)
        })
    }

    update(dt) {
        // 伪进度条移动
        if (this.pb.progress >= 1) {
            return
        } else {
            this.pb.progress += C.FAKE_BAR_V * dt
        }

    }

    /** 初始化本地数据 */
    inin_local_data() {
        // 输出log
        if (L.is_init === true.toString()) {
            cc.warn('检测到本地用户数据')
            return
        } else {
            cc.warn('未检测到本地用户数据，正在进行进行用户数据初始化')
        }

        //////////
        // 这里是各个项目的本地数据初始化过程
        //////////

        L.music = true
        L.sound = true
        L.language = 'english'

        // 初始化完毕之后，置is_init为true
        L.is_init = true
    }

    /** 初始化测试环境的本地数据 */
    init_test_local_data() {
        //////////
        // 这里是各个项目在测试环境中的本地数据初始化过程
        //////////
    }

    /** 
     * 调整屏幕适配
     * - 默认为竖屏1136*640，如果有改动，请改动本文件开头C 
     */
    adjust_screen() {
        if (cc.winSize.height / cc.winSize.width > C.SCREEN_RATIO) {
            [this.canvas.fitHeight, this.canvas.fitWidth] = [false, true]
        } else {
            [this.canvas.fitHeight, this.canvas.fitWidth] = [true, false]
        }
    }
}