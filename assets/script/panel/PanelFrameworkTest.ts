import { FPanel } from "../framework/FPanel";
import { FNative } from "../framework/FNative";

const { ccclass, property, menu } = cc._decorator
const C = {

}

/**
 * [Panel] PanelFrameworkTest
 */
@ccclass
@menu("panel/PanelFrameworkTest")
@FPanel.SetPanelContext("panel/PanelFrameworkTest")
export class PanelFrameworkTest extends FPanel.PanelBase {

    async on_create() {
        this.init_fnative()
    }

    async on_open() {

    }

    async on_close() {

    }

    @property(cc.Label)
    private test_result: cc.Label = null
    private show_result(result: string) {
        this.test_result.string = result
    }
    private event_clear_result() {
        this.test_result.string = "-"
    }

    @property(cc.Node)
    private module_fnative: cc.Node = null
    private init_fnative() {
        cc.find("call", this.module_fnative).on("click", () => {
            this.show_result(FNative.call("TestCall", ""))
        })
        cc.find("call_async", this.module_fnative).on("click", async () => {
            this.show_result(await FNative.call_async("TestCallAsync", { test: "test" }))
        })
    }

    private event_close() {
        FPanel.close(PanelFrameworkTest)
    }
}
