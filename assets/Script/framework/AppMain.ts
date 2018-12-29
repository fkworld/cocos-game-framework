import { L } from "./L";
import { G } from "./G";
import { MRes } from "./MRes";
import { MPanel } from "./MPanel";
import { MSound } from "./MSound";
import { MLanguage } from "./MLanguage";
import { TNull } from "./TNull";

const { ccclass, property } = cc._decorator
const C = {
    WAIT_TIME: 1,
    FADE_TIME: 1,

}
Object.freeze(C)

/**
 * [framework] 游戏启动主入口
 * - 调整屏幕适配方案
 * - 显式调用本地存储初始化、游戏资源的初始化、声音初始化、界面初始化
 * - Loading界面的相关逻辑
 */
@ccclass
class AppMain extends cc.Component {

    start() {
        TNull.get(this.panel_loading).schedule(() => {
            this.load_icon.rotation += 45
        }, 0.1, cc.macro.REPEAT_FOREVER)
        this.adjust_screen()
        this.init_local_data()
        MSound.init()
        MPanel.init(this.panel_parent)
        MRes.init(() => { this.check_load_finish() })
    }

    /** 载入完毕计数 */
    load_count = 0
    /** 载入完毕总计数 */
    max_load_count = 1

    /**
     * 检查载入计数，执行载入完毕逻辑
     * - 目前有两个计数：MRes的资源载入完毕；进度条载入完毕
     */
    async check_load_finish() {
        this.load_count += 1
        if (this.load_count < this.max_load_count) { return }
        await G.wait_time(C.WAIT_TIME)
        await MPanel.out_fade(this.panel_loading, C.FADE_TIME)
        this.panel_loading.active = false
        MPanel.chain('PanelTest')
    }

    @property({ tooltip: '游戏主Canvas', type: cc.Canvas })
    canvas: cc.Canvas = null

    @property({ tooltip: '游戏loading界面', type: cc.Node })
    panel_loading: cc.Node = null

    @property({ tooltip: 'panel所挂载的父节点', type: cc.Node })
    panel_parent: cc.Node = null

    @property({ tooltip: 'load过程的icon', type: cc.Node })
    load_icon = null

    /** 初始化本地数据 */
    init_local_data() {
        // 测试阶段每次打开时均需要初始化，正是上线后注释掉
        L.is_init = false
        // 输出log
        if (L.is_init === 'true') { cc.warn(`[${AppMain.name}] get user\'s local data`); return }
        else { cc.warn(`[${AppMain.name}] unget user\'s local data, init now...`) }

        //////////
        // 这里是各个项目的本地数据初始化过程
        //////////

        MSound.init_l()
        MLanguage.init_l()

        // 初始化完毕之后，置is_init为true
        L.is_init = true
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