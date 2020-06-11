const { ccclass, property, menu } = cc._decorator;

/**
 * panel类的例子，建立新建的panel类直接复制此脚本
 */
@ccclass
@menu("panel/PanelExample")
@fy.DeSetPanelContext("panel/PanelExample.prefab")
export class PanelExample extends fy.PanelBase {
  async on_create() {}

  async on_open() {}

  async on_close() {}
}
