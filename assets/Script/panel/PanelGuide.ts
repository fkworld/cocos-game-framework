import MPanel from "../framework/MPanel";

const { ccclass, property } = cc._decorator;

/**
 * [framework-panel] Guide
 */
@ccclass
export default class PanelGuide extends cc.Component {

    async open(mask_world_position: cc.Vec2, mask_width: number, mask_height: number, info: string) {
        this.init(mask_world_position, mask_width, mask_height, info)
        await MPanel.in_fade(this.node)
        cc.director.pause()
    }

    async close() {
        cc.director.resume()
        await MPanel.out_fade(this.node)
    }

    @property(cc.Node)
    n_mask: cc.Node = null

    @property(cc.Node)
    n_info: cc.Node = null

    @property(cc.Widget)
    mask_bg: cc.Widget = null

    @property(cc.Widget)
    mask_arrow: cc.Widget = null

    /**
     * 初始化界面
     * @param mask_world_position mask的世界坐标
     * @param mask_width 
     * @param mask_height 
     * @param info 
     */
    init(mask_world_position: cc.Vec2, mask_width: number, mask_height: number, info: string) {
        this.n_mask.position = this.n_mask.convertToNodeSpaceAR(mask_world_position)
        this.n_mask.width = mask_width
        this.n_mask.height = mask_height
        this.mask_bg.updateAlignment()
        this.mask_arrow.updateAlignment()
        this.n_info.getComponent(cc.Label).string = info
    }

    /** click event close */
    event_close() {
        MPanel.close('PanelGuide')
    }
}
