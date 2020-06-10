const { ccclass, property, executeInEditMode } = cc._decorator;

/**
 * 文字工具
 * - 支持 cc.Label cc.RichText cc.Sprite 三种不同的组件。
 */
@ccclass
@executeInEditMode
export class TText extends cc.Component {
  onLoad() {
    if (CC_EDITOR) {
      fy.set_node_text(this.node,this.key,...this.params)
    } else {
      this.is_onload && fy.set_node_text(this.node,this.key,...this.params)
    }
  }

  @property({ tooltip: "字符串key" })
  private key = "none";

  @property({ tooltip: "字符串参数" })
  private params: string[] = [];

  @property({ tooltip: "是否在onLoad时候修改，默认为true" })
  private is_onload: boolean = true;

  @property({ tooltip: "编辑器操作" })
  private get E() {
    return false;
  }
  private set E(v: boolean) {
    CC_EDITOR && fy.set_node_text(this.node,this.key,...this.params)
  } 
}
