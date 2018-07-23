import UIPanel from "./UIPanel";

const { ccclass, property } = cc._decorator

/** 参数 */
const CONFIG = {
    /** 路径参数 */
    PATH: "panel",
}

/**
 * 框架文件：游戏panel管理类
 * - 封装load，show，hide的外部接口
 * - 载入resources/[G.panel_path]下的所有窗口的prefab，挂载在panel_parent下
 * - G.panel_path定义在G.js中
 */
@ccclass
export default class UIPanelManager extends cc.Component {

    /** 
     * panel挂载的父节点
     * @type {cc.Node}
     */
    @property(cc.Node)
    panel_parent = null

    /**
     * 构造函数
     */
    constructor() {
        super()
        /** 当前的渲染 */
        this.now_z_index = 0
    }

    /**
     * 脚本运行实例
     * @type {UIPanelManager} UIPanelManager._instance
     */
    static get ins() { return UIPanelManager._instance }
    static set ins(instance) { UIPanelManager._instance = instance }

    /** 
     * 载入总量
     * @type {number}
     */
    get all_count() { return this._all_count }
    set all_count(count) { this._all_count = count }

    /** 
     * 当前载入量
     * @type {number}
     */
    get load_count() { return this._all_count }
    set load_count(count) { this._load_count = count }

    onLoad() {
        this.load_a_default_panel_parent()
        this.load_all_panel()

        // 保存脚本运行实例
        UIPanelManager.ins = this
    }

    /** 载入一个默认的panel挂载父节点 */
    load_a_default_panel_parent() {
        if (this.panel_parent === null) {
            cc.warn("未传入ui的父节点，已经分配一个默认父节点")
            // 默认父节点往往有显示错误，因此尽量还是传入一个父节点参数
            this.panel_parent = this.node
        }
    }

    /**
     * 载入所有的panel
     * - 只载入CONFIG.PATH下的cc.Prefab
     * - cc.loader.loadResDir()是一个异步加载过程，因此可能会预见一些加载流程上的BUG
     */
    load_all_panel() {
        /** 存储所有panel的node */
        this.panel_array = {}
        /** 是否载入资源完毕 */
        this.is_load_over = false
        cc.loader.loadResDir(
            // panel的路径，注意必须要在asset/resource下
            CONFIG.PATH,
            // 格式
            cc.Prefab,
            // 每载入一个资源后的回调函数
            (completedCount, totalCount, item) => {
                // perfab的载入无法用item做完全区分，比较复杂
                return
            },
            // 载入全部资源后的回调函数
            (err, res) => {
                // 载入失败
                if (err) {
                    cc.error("载入窗口资源失败，err=", err)
                    // 注意这里也需要修改对应flag
                    this.is_load_over = true
                    return
                }
                // 写入数据
                // 更新相关数据
                this.all_count = res.length
                this.load_count = 0
                for (let prefab of res) {
                    // 创建node并写入
                    let panel_node = cc.instantiate(prefab)
                    panel_node.parent = this.panel_parent
                    panel_node.active = false
                    this.panel_array[prefab.name] = new UIPanel(panel_node)
                    // 更新数据
                    this.load_count += 1
                }
                // 载入成功
                cc.info("载入窗口资源成功")
                this.is_load_over = true
            }
        )
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
            panel.panel_node.getComponent(panel_name).show()
        } catch (error) {
            panel.show()
        }
        // 修改渲染深度，使其置于顶部
        this.now_z_index += 1
        panel.zIndex = this.now_z_index
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
        panel.panel_node.getComponent(panel_name).hide()
        // 切记要把渲染深度改回去
        // 要么就在hide()动作结束后改深度，要么就干脆不该深度，2选1
        // panel.zIndex = 0
    }


    /**
     * 检查窗口名称
     * @param {string} panel_name 窗口名称
     * @returns {boolean | UIPanel}
     */
    check_panel(panel_name) {
        let panel = this.panel_array[panel_name]
        if (panel === undefined) {
            cc.error("查找的窗口不存在，panel_name=", panel_name)
            return false
        }
        return panel
    }
}