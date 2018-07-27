import { L } from "./LocalData";
import MRes from "./MRes";

const { ccclass, property } = cc._decorator

/**
 * 框架文件，游戏启动主入口
 * - 包括控制游戏资源的初始化过程
 */
@ccclass
class AppMain extends cc.Component {

    /** @type {cc.ProgressBar} progress bar */
    @property(cc.ProgressBar)
    pb = null

    /** @type {cc.Label} loading log */
    @property(cc.Label)
    ll = null

    start() {
        let max_step = 2

        // 0：等待资源载入完毕
        this.loading_log = "正在载入资源"
        let f = setInterval(() => {
            if (MRes.ins.is_load_over) {
                clearInterval(f)
            }
        }, 200)

        setTimeout(() => { }, 5000)
        cc.log(1)

        // 1：初始化本地数据
        this.loading_log = "正在检查本地数据"
        L.is_init = false
        this.inin_local_data()
        this.init_test_local_data()
    }

    update() {

    }

    /** 载入的输出log */
    set loading_log(log) { this.ll.string = log }

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