import { CONFIG_META } from "../../resources/csv/auto-generate";
import { CONFIG_AUDIO } from "../config/ConfigAudio";
import { CONFIG_COLOR } from "../config/ConfigColor";
import { CONFIG_LOCAL } from "../config/ConfigLocal";
import { CONFIG_LANGUAGE } from "../config/ConfigText";
import { CONFIG_VERSION, CONFIG_VERSION_INFO } from "../config/ConfigVersion";
import { PanelExample } from "../panel/PanelExample";

const { ccclass, property } = cc._decorator;
const APP_CONFIG: fy.Config = {
  version: CONFIG_VERSION,
  version_info: CONFIG_VERSION_INFO,
  local: CONFIG_LOCAL,
  text: CONFIG_LANGUAGE,
  color: CONFIG_COLOR,
  audio: CONFIG_AUDIO,
  meta: CONFIG_META,
  editor_language: "chinese",
  panel_parent: undefined,
  log_level: fy.LogLevel.DEV,
};
CC_EDITOR && fy.init(APP_CONFIG);

/**
 * 游戏启动主入口
 * - 需要挂在 Canvas 节点下。
 * - 显式调用调整屏幕适配，各子系统初始化，游戏启动逻辑等。
 */
@ccclass
export class App extends cc.Component {
  start() {
    this.start_app();
  }

  @property({ tooltip: "点击创建json文件" })
  private get E() {
    return false;
  }
  private set E(v: boolean) {
    CC_EDITOR && fy.parse_csv_all();
  }

  @property({ tooltip: "panel所挂载的父节点", type: cc.Node })
  private panel_parent: cc.Node = null;

  /** app启动逻辑 */
  private async start_app() {
    // loading动画
    // this.loading_show()
    // 各子系统初始化
    APP_CONFIG.panel_parent = this.panel_parent;
    await fy.init(APP_CONFIG);
    fy.adjust_canvas(cc.Canvas.instance);
    // 游戏启动逻辑
    fy.open_panel(PanelExample);
    // 载入完毕，关闭loading页面
    // this.loading_hide()
  }

  @property(cc.Node)
  private panel_loading: cc.Node = null;

  @property(cc.ProgressBar)
  private pb_progress: cc.ProgressBar = null;
  private PROGRESS_TWEEN_TAG = 1024;

  @property(cc.Label)
  private label_progress: cc.Label = null;

  private loading_show() {
    this.pb_progress.progress = 0;
    this.label_progress.string = "0%";
    cc.tween(this.pb_progress)
      .tag(this.PROGRESS_TWEEN_TAG)
      .set({ progress: 0 })
      .to(0.5, { progress: _.random(0.3, 0.6) })
      .delay(0.2)
      .to(0.5, { progress: _.random(0.7, 0.9) })
      .delay(0.2)
      .to(0.5, { progress: 0.98 })
      .start();
  }

  private loading_hide() {
    cc.Tween.stopAllByTag(this.PROGRESS_TWEEN_TAG);
    this.pb_progress.progress = 1;
    this.label_progress.string = "100%";
    cc.tween(this.panel_loading)
      .delay(0.2)
      .to(0.5, { opacity: 0 })
      .call(() => {
        this.panel_loading.active = false;
      })
      .start();
  }
}
