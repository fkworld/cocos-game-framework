import MPanel from "../framework/MPanel";

enum GUIDE_TYPE { test1, test2 }

/**
 * [framework-S] Guide system
 * - guide_type -> guide_info -> guide_panel
 */
export default class SGuide {

    /** 引导的枚举类型 */
    static get TYPE() { return GUIDE_TYPE }

    static open(type: GUIDE_TYPE) {
        if (!GUIDE_TYPE[type]) { cc.error(`get a non-type, type=${type}`); return }
        MPanel.open('PanelGuide', ...SGuide.get_guide_info(type))
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
}