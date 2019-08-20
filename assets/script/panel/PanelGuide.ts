import { FPanel } from "../framework/FPanel";
import { G } from "../framework/G";

const { ccclass, property, menu } = cc._decorator;

interface Params {
    open: {
        w_position: cc.Vec2;    // 世界坐标
        info: string;           // 描述信息
    }
}

/**
 * [Panel] PanelGuide + system
 */
@ccclass
@menu("panel/PanelGuide")
@FPanel.config_panel("PanelGuide")
export class PanelGuide extends FPanel.FPanelTemplate {

    async on_open(params: Params["open"]) {
        this.arrow_point.position = G.get_node_local_position(this.arrow_point, params.w_position)
        this.label_info.string = params.info
    }

    @property(cc.Label)
    private label_info: cc.Label = null

    @property(cc.Node)
    private arrow_point: cc.Node = null

    private event_close() {
        FPanel.close(PanelGuide, {})
    }
}
