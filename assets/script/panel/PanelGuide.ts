import { FAnima } from "../framework/FAnima";
import { fm_panel_config, FPanel, FPanelExtends } from "../framework/FPanel";
import { G } from "../framework/G";

const { ccclass, property, menu } = cc._decorator;

/** 界面打开关闭参数 */
interface Params {
    Open: {
        w_position: cc.Vec2;    // 世界坐标
        info: string;           // 描述信息
    }
}

/**
 * [Panel] PanelGuide + system
 */
@ccclass
@menu("panel/PanelGuide")
@fm_panel_config("PanelGuide", "cover")
export class PanelGuide extends FPanelExtends {

    async on_open(params: Params["Open"]) {
        this.arrow_point.position = G.get_node_local_position(this.arrow_point, params.w_position)
        this.label_info.string = params.info
        await Promise.all([
            FAnima.in_fade_move(this.arrow_point, { direction: "down" }),
            FAnima.in_move(this.bg_info, { direction: "down" }),
        ])
        cc.director.pause()
    }

    async on_close() {
        cc.director.resume()
        await Promise.all([
            FAnima.out_fade_move(this.arrow_point, { direction: "up" }),
            FAnima.out_move(this.bg_info, { direction: "down" })
        ])
    }

    @property(cc.Node)
    private bg_info: cc.Node = null

    @property(cc.Label)
    private label_info: cc.Label = null

    @property(cc.Node)
    private arrow_point: cc.Node = null

    /** click event close */
    private event_close() {
        FPanel.close(PanelGuide, {})
    }
}
