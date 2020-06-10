/**
 * 界面模块
 * - 需要在运行时初始化，传入父节点
 */

import { log, LogLevel } from "./log";
import { SimpleFSM } from "./tool-fsm";
import { load_res } from "./tool-ccc";

/**
 * 界面类型
 * - new 新创建一个页面
 * - old 寻找旧页面，将node.active置为 true
 */
type PanelType = "new" | "old";

/**
 * 节点状态
 * - open 打开状态
 * - close 关闭状态
 * - 注意：为当前状态描述，无视打开关闭动画
 */
type PanelState = "open" | "close";

type PanelContext = {
  /** prefab 的路径 */
  path: string;
  /** zindex 的基础值 */
  z_index_base: number;
  /** prefab */
  prefab: cc.Prefab;
  /** 示例 */
  ins: PanelBase;
  /** 类别 */
  type: PanelType;
  /** 当前状态 */
  state: SimpleFSM<PanelState>;
};

/** 父节点 */
let parent: cc.Node;

/** 当前节点的 node.zIndex */
let now_z_index: number = 0;

/** 界面脚本的实现基类 */
export abstract class PanelBase extends cc.Component {
  /** 界面的上下文信息 */
  static context: PanelContext;
  /** 界面首次打开执行函数，处理只执行1次的逻辑，比如创建 */
  abstract async on_create(): Promise<void>;
  /** 界面打开函数，处理动画和逻辑，会在onLoad之后，start之前执行 */
  abstract async on_open(...params: any[]): Promise<void>;
  /** 界面关闭函数，处理动画和逻辑，会在onDestroy之前执行 */
  abstract async on_close(...params: any[]): Promise<void>;
}

/**
 * 设置panel类上下文的装饰器
 * @param config
 */
export function DeSetPanelContext(path: string, type = "old", z_index_base = 0) {
  return (constructor: typeof PanelBase) => {
    constructor.context = {
      path: path,
      z_index_base: z_index_base,
      type: type as PanelType,
      prefab: undefined,
      ins: undefined,
      state: new SimpleFSM<PanelState>("close", {
        open: ["close"],
        close: ["open"],
      }),
    };
  };
}

/** panel的子类 */
type PanelClass = typeof PanelBase;

/** panel子类的on_open方法参数 */
type ParamPanelOpen<T extends PanelClass> = Parameters<T["prototype"]["on_open"]>;

/** panel子类的on_close方法参数 */
type ParamPanelClose<T extends PanelClass> = Parameters<T["prototype"]["on_close"]>;

/**
 * 初始化系统，传入父节点
 * @param node
 */
export function _init_panel(node: cc.Node = new cc.Node()) {
  parent = node;
}

/**
 * 预载入界面 prefab
 * @param panel
 */
export async function pre_panel(panel: PanelClass) {
  if (!panel.context.prefab) {
    panel.context.prefab = await load_res(panel.context.path, cc.Prefab);
  }
}

/**
 * 获取界面实例，如果获取不到，则创建新的
 * @param panel
 */
async function get_panel(panel: PanelClass) {
  if (!panel.context.ins) {
    await pre_panel(panel);
    let node = cc.instantiate(panel.context.prefab);
    node.parent = parent;
    node.position = cc.Vec3.ZERO;
    node.width = cc.winSize.width;
    node.height = cc.winSize.height;
    panel.context.ins = node.getComponent(panel);
    await panel.context.ins.on_create();
  }
  return panel.context.ins;
}

/**
 * 打开页面
 * @param panel
 * @param params
 */
export async function open_panel<T extends PanelClass>(panel: T, ...params: ParamPanelOpen<T>) {
  // 校验
  if (!panel.context.state.try_go_state("open")) {
    return;
  }
  // 载入
  let z_index = (now_z_index += 1);
  let ins = await get_panel(panel);
  ins.node.zIndex = z_index + panel.context.z_index_base;
  ins.node.active = true;
  // 动画
  await panel.context.ins.on_open(...params);
}

/**
 * 关闭页面
 * @param panel
 * @param params
 */
export async function close_panel<T extends PanelClass>(panel: T, ...params: ParamPanelClose<T>) {
  // 校验
  if (!panel.context.state.try_go_state("close")) {
    return;
  }
  // 删除实例
  await panel.context.ins.on_close(...params);
  if (panel.context.type === "new") {
    panel.context.ins.node.destroy();
    panel.context.ins = undefined;
  } else if (panel.context.type === "old") {
    panel.context.ins.node.active = false;
  }
}
