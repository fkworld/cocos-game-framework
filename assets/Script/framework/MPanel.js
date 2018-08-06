import PanelBase from "./PanelBase";
import MRes from "./MRes";

const { ccclass, property } = cc._decorator

/**
 * 框架文件：游戏panel管理类
 * - 封装load，show，hide的外部接口
 * - 将所有的panel prefab资源创建为node，并保存在传入的父节点下
 * - 游戏窗口有多种打开方式：默认打开方式、其他规定的打开方式，规定之外的自定义打开方式
 */
@ccclass
export default class MPanel extends cc.Component {

    /** @type {MPanel} */
    static ins

    /** 
     * panel挂载的父节点
     * @type {cc.Node}
     */
    @property(cc.Node)
    panel_parent = null

    /** @type {cc.Node} panel_loading */
    @property(cc.Node)
    panel_loading = null

    onLoad() {
        // 初始化
        /** 当前的渲染 */
        this.now_z_index = 0

        // 初始化存储
        /** panel数组 */
        this.panel_array = {}

        // 保存脚本运行实例
        MPanel.ins = this
    }

    /** 创建所有的panel */
    create_all_panel() {
        for (let prefab of MRes.ins.array_panel) {
            // 创建node并写入
            let node = cc.instantiate(prefab)
            node.parent = this.panel_parent
            node.active = false
            this.panel_array[prefab.name] = new PanelBase(node)
        }
        // 匹配loadingpanel
        // 需要prefab里没有同名的panel
        this.panel_array["PanelLoading"] = new PanelBase(this.panel_loading)
        cc.log("创建所有UI节点成功")
    }

    /**
     * 显示panel
     * @param {string} panel_name 窗口名
     */
    panel_show(panel_name) {
        let panel = this.check_panel(panel_name)
        if (panel === false) {
            return
        }
        // 优先采用窗口自带的显示方式
        try {
            panel.node.getComponent(panel_name).show()
        } catch (error) {
            panel.show()
        }
        // 修改渲染深度，使其置于顶部
        this.now_z_index += 1
        panel.node.zIndex = this.now_z_index
    }

    /**
     * 隐藏panel
     * @param {string} panel_name 窗口名
     */
    panel_hide(panel_name) {
        let panel = this.check_panel(panel_name)
        if (panel === false) {
            return
        }
        // 优先采用窗口自带的关闭方式
        try {
            panel.node.getComponent(panel_name).show()
        } catch (error) {
            panel.show()
        }
        // 要么就在hide()动作结束后改深度，要么就干脆不改深度，2选1
        // panel.zIndex = 0
    }


    /**
     * 检查窗口名称
     * @param {string} panel_name 窗口名称
     * @returns {false | PanelBase}
     */
    check_panel(panel_name) {
        let panel = this.panel_array[panel_name]
        if (panel === undefined) {
            cc.error("查找的panel不存在，panel_name=", panel_name)
            return false
        }
        return panel
    }
}