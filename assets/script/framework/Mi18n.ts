import { G } from "./G";
import { L } from "./L";
import { Mi18n_en } from "./Mi18n_en";
import { Mi18n_zh } from "./Mi18n_zh";
import { MLog } from "./MLog";
import { MVersion } from "./MVersion";

const { ccclass, property, executeInEditMode, requireComponent, menu } = cc._decorator
/** 语言类型 */
enum TYPE { en, zh }
const C = {
    DATA: {
        en: Mi18n_en,
        zh: Mi18n_zh,
    },                              // 数据对应
    EDITOR_TYPE: TYPE[TYPE.en],     // 编辑器语言
    DEFAULT_KEY: 'enter-a-key',     // 默认key
}

/**
 * [M] 国际化-多语言
 * - 修改对应配置文件中的内容，key-value格式
 * - [用法] 将此组件挂载在对应的Label所在节点下，修改key
 * - [用法] 使用静态接口text()
 */
@ccclass
@executeInEditMode
@requireComponent(cc.Label)
@menu("framework/Mi18n")
export class Mi18n extends cc.Component {

    /** 初始化本地存储 */
    static init_local() { L.language = C.EDITOR_TYPE }

    /**
     * 获取key对应的value并组合成为字符串
     * @param key
     * @param param
     */
    static text(key: string, ...param: any[]): string {
        let type = MVersion.run_editor || !L.language ? C.EDITOR_TYPE : L.language
        let value = C.DATA[type][key]
        if (!value) {
            value = key
            MLog.warn(`@Mi18n: get a not exist key, key=${key}`)
        }
        return G.fake_template_string(value, ...param)
    }

    onLoad() {
        this.update_label()
    }

    update() {
        if (MVersion.run_editor && this.preview) {
            this.preview = false
            this.update_label()
        }
    }

    /** key；无法使用notify() */
    @property({ tooltip: '字符串key' })
    private key: string = C.DEFAULT_KEY

    /** 参数 */
    @property({ tooltip: '字符串参数', type: cc.String })
    private param: string[] = []

    /** 预览（点击后刷新编辑器） */
    @property({ tooltip: '预览1次；预览完毕后置于false' })
    private preview: boolean = false

    /**
     * 更新label
     * - 目前仅支持cc.Label组件
     * @param label node中的cc.Label组件
     */
    private update_label() {
        this.node.getComponent(cc.Label).string = Mi18n.text(this.key, ...this.param)
    }
}