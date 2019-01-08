import { MPanel, IPanel } from "../framework/MPanel";

const { ccclass, property } = cc._decorator;
enum GUIDE_TYPE { test1, test2 }

/**
 * [framework-panel] Guide+system
 * - guide_type -> guide_info -> guide_panel
 */
@ccclass
export class PanelGuide extends cc.Component implements IPanel {

    /** 引导的枚举类型 */
    static get TYPE() { return GUIDE_TYPE }

    static open(type: GUIDE_TYPE) {
        if (!GUIDE_TYPE[type]) { cc.error(`get a non-type, type=${type}`); return }
        MPanel.open('PanelGuide', ...PanelGuide.get_guide_info(type))
    }

    static close() {
        MPanel.close('PanelGuide')
    }

    /**
     * 获得guide信息
     * @param type 
     */
    static get_guide_info(type: GUIDE_TYPE) {
        let world_position: cc.Vec2;
        let width: number;
        let height: number;
        let info: string;
        switch (type) {
            case GUIDE_TYPE.test1:
                world_position = cc.v2(500, 500)
                width = 100
                height = 100
                info = `this is a guide info of ${GUIDE_TYPE[GUIDE_TYPE.test1]}`
                break;
            case GUIDE_TYPE.test2:
                world_position = cc.v2(500, 500)
                width = 100
                height = 100
                info = `this is a guide info of ${GUIDE_TYPE[GUIDE_TYPE.test2]}`
                break;
            default:
                break;
        }
        return [world_position, width, height, info]
    }

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
