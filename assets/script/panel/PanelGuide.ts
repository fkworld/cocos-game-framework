import { MPanel, MPanelImplements } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator;

/**
 * [Panel] Guide+system
 */
@ccclass
@menu("panel/PanelGuide")
export class PanelGuide extends cc.Component implements MPanelImplements {

    static path = 'PanelGuide'

    static async open(world_position: cc.Vec2, info: string) {
        MPanel.open(PanelGuide, world_position, info)
    }

    static async close() {
        MPanel.close(PanelGuide)
    }

    async on_open(world_position: cc.Vec2, info: string) {
        this.arrow_point.position = this.arrow_point.parent.convertToNodeSpaceAR(world_position)
        this.label_info.string = info
        MPanel.in_fade_move(this.arrow_point, 'down')
        await MPanel.in_move(this.bg_info, 'down')
        cc.director.pause()
    }

    async on_close() {
        cc.director.resume()
        MPanel.out_fade_move(this.arrow_point, 'up')
        await MPanel.out_move(this.bg_info, 'down')
    }

    @property(cc.Node)
    bg_info: cc.Node = null

    @property(cc.Label)
    label_info: cc.Label = null

    @property(cc.Node)
    arrow_point: cc.Node = null

    /** click event close */
    event_close() {
        PanelGuide.close()
    }
}
