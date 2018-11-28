import MPanel from "../framework/MPanel";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * [framework-panel] Guide
 */
@ccclass
export default class PanelGuide extends cc.Component {

    open() {
        MPanel.in_fade(this.node)
    }

    async close() {
        return await MPanel.out_fade(this.node)
    }

    @property(cc.Node)
    n_mask: cc.Node = null

    @property(cc.Node)
    n_info: cc.Node = null

    /**
     * 初始化界面
     * @param mask_position 
     * @param mask_width 
     * @param mask_height 
     * @param info 
     */
    init(mask_position: cc.Vec2, mask_width: number, mask_height: number, info: string) {
        this.n_mask.position = mask_position
        this.n_mask.width = mask_width
        this.n_mask.height = mask_height
        this.n_info.getComponent(cc.Label).string = info
        this.n_info.position = mask_position.y >= 0 ? cc.v2(0, -400) : cc.v2(0, 400)
    }
}
