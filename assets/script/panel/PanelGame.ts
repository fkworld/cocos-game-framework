import { MPanel, MPanelExtends } from "../framework/MPanel";

const { ccclass, property, menu } = cc._decorator
const C = {

}
interface OpenParams { }
interface CloseParams { }

/**
 * [Panel] PanelGame
 */
@ccclass
@menu("panel/PanelGame")
export class PanelGame extends MPanelExtends {

    static config = {
        open_type: <"false">"false",
        open_params: <OpenParams>{},
        close_params: <CloseParams>{},
    }

    async on_open(params: OpenParams) {

    }

    async on_close(params: CloseParams) {

    }
}