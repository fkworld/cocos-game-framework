import { MPanel, MPanelImplements } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator

/**
 * [Panel] PanelBase
 * - 建议直接通过复制PanelBase.prefab/PanelBase.ts来新建窗口
 */
@ccclass
@menu("panel/PanelBase")
export class PanelBase extends cc.Component implements MPanelImplements {

    static path = 'PanelBase'

    static async open() {
        await MPanel.open(PanelBase)
    }

    static async close() {
        await MPanel.close(PanelBase)
    }

    async on_open() { }

    async on_close() { }
}