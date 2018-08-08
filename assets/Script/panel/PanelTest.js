import MPanel from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * 框架文件：PanelTest
 * - 可以删除
 * - 用于测试一些Panel的显示和隐藏功能
 */
@ccclass
class PanelTest extends cc.Component {
    show() { MPanel.show_with_scale(this.node) }
}