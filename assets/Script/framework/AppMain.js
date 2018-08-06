import { L } from "./LocalData";
import MRes from "./MRes";
import MPanel from "./MPanel";

const { ccclass, property } = cc._decorator

const C = {
    /** 假进度条的移动速度 */
    FAKE_BAR_V: 0.5,
    /** 假进度条满了之后的延迟时间 */
    FAKE_BAR_DELAY: 1,
}

/**
 * 框架文件，游戏启动主入口
 * - 包括控制游戏资源的初始化过程
 */
@ccclass
class AppMain extends cc.Component {

    /** @type {cc.ProgressBar} progress bar */
    @property(cc.ProgressBar)
    pb = null

    start() {
        MRes.ins.load_chain().then(() => {
            // 1、初始化本地数据
            L.is_init = false
            this.inin_local_data()
            this.init_test_local_data()
            // 2、针对资源进行二次存储（修改存储结构）
            MPanel.ins.create_all_panel()
            // 3、显示游戏界面
            this.pb.progress = 1
            this.scheduleOnce(() => {
                // MPanel.ins.panel_hide("PanelLoading")
            }, C.FAKE_BAR_DELAY)
        })
        this.pb.progress = 0
    }

    update(dt) {
        if (this.pb.progress >= 1) { return }
        this.pb.progress += C.FAKE_BAR_V * dt
    }

    /** 初始化本地数据 */
    inin_local_data() {
        if (L.is_init === true.toString()) {
            cc.log("已有本地用户数据，不再进行用户数据初始化")
            return
        }
        cc.warn("未检测到本地用户数据，正在进行进行用户数据初始化")

        //////////
        // 这里是各个项目的本地数据初始化过程
        //////////

        L.is_init = true
    }

    /** 初始化测试环境的本地数据 */
    init_test_local_data() {
        //////////
        // 这里是各个项目在测试环境中的本地数据初始化过程
        //////////
    }
}