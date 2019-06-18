import { FMPanel, FMPanelExtends, FMPanelConfig } from "../framework/fm-panel";

const { ccclass, property, menu } = cc._decorator;

/** 界面打开参数接口 */
interface ParamOpen {
    w_position: cc.Vec2
    info: string
}

/**
 * [Panel] PanelGuide + system
 */
@ccclass
@menu("panel/PanelGuide")
@FMPanelConfig("PanelGuide")
export class PanelGuide extends FMPanelExtends {

    async on_open(param: ParamOpen) {
        this.arrow_point.position = this.arrow_point.parent.convertToNodeSpaceAR(param.w_position)
        this.label_info.string = param.info
        FMPanel.in_fade_move(this.arrow_point, "down")
        await FMPanel.in_move(this.bg_info, "down")
        cc.director.pause()
    }

    async on_close() {
        cc.director.resume()
        FMPanel.out_fade_move(this.arrow_point, "up")
        await FMPanel.out_move(this.bg_info, "down")
    }

    @property(cc.Node)
    bg_info: cc.Node = null

    @property(cc.Label)
    label_info: cc.Label = null

    @property(cc.Node)
    arrow_point: cc.Node = null

    /** click event close */
    event_close() {
        FMPanel.close(PanelGuide, {})
    }
}
