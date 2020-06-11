const { ccclass, property, executeInEditMode } = cc._decorator;

/**
 * 颜色工具
 * - 如果未来有多个颜色配置文件，则需要同 FText 一样。
 */
@ccclass
@executeInEditMode
export class TColor extends cc.Component {
  onLoad() {
    if (CC_EDITOR) {
      fy.set_node_color(this.node,this.key)
    } else {
      this.is_onload && fy.set_node_color(this.node,this.key)
    }
  }

  @property({ tooltip: "是否在onload中执行" })
  private is_onload = true;

  @property({ tooltip: "颜色字符串" })
  private key: string = "none";

  @property({ tooltip: "编辑器操作" })
  private get E() {
    return false;
  }
  private set E(v: boolean) {
    CC_EDITOR && fy.set_node_color(this.node,this.key)
  }
}
