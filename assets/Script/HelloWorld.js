import AudioManager from "./framework/AudioManager";
import UIPanelManager from "./framework/UIPanelManager";

const { ccclass, property } = cc._decorator

@ccclass
class H extends cc.Component {
    start() {
        this.scheduleOnce(() => {
            cc.log(1)
            cc.log(UIPanelManager.ins.panel_array)
            UIPanelManager.ins.panel_show("TestPanel")
        }, 3)
        // UIPanelManager.ins.panel_show("TestPanel")
    }
}
