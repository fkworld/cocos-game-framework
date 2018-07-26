import PanelBase from "./PanelBase";

const { ccclass, property } = cc._decorator

/**
 * 框架文件：demo-panel
 * - 所有的panel的代码格式请参考这个demo
 * - 如果需要自定义显示方式，则需要添加show()和hide()方法，并获取UIPanel的封装方法
 */
@ccclass
class PanelDemo extends cc.Component {
    onLoad() {
        /** 得到封装的UIPanel方法 */
        // this.ui = new PanelBase(this.node)
    }
}