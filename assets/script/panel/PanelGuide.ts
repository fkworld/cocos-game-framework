import { FPanel } from "../framework/FPanel";
import { G } from "../framework/G";

const { ccclass, property, menu } = cc._decorator;

/**
 * [Panel] PanelGuide
 */
@ccclass
@menu("panel/PanelGuide")
export class PanelGuide extends cc.Component implements FPanel.FPanelTemplate {

    CONFIG = {
        path: "PanelGuide",
        is_multiple: false,
        type_open: null as {
            msg: string,            // 描述信息
            w_position: cc.Vec2;    // 世界坐标
        },
        type_close: null as {},
    }

    async on_open(params: typeof PanelGuide.prototype.CONFIG.type_open) {
        this.arrow_point.position = G.get_node_position_by_world_position(this.arrow_point, params.w_position) as any
        this.label_info.string = params.msg
    }

    async on_close() {

    }

    @property(cc.Label)
    private label_info: cc.Label = null

    @property(cc.Node)
    private arrow_point: cc.Node = null

    private event_close() {
        FPanel.close(PanelGuide, {})
    }
}
