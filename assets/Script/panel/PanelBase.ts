import { MPanel, MPanelImplements } from "../framework/MPanel";

const { ccclass, property } = cc._decorator

/**
 * [Panel] PanelBase
 */
@ccclass
export class PanelBase extends cc.Component implements MPanelImplements {

    static async open() { await MPanel.open(PanelBase.name) }
    static async close() { await MPanel.close(PanelBase.name) }
    async on_open() { }
    async on_close() { }
}