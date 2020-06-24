/**
 * 界面模块
 * - 需要在运行时初始化，传入父节点
 * @see https://www.yuque.com/fengyong/game-develop-road/olfgzo
 */

import { load_res_async } from "./tool-ccc";

/** 界面类型 */
enum PanelType {
  /** 新创建一个页面 */
  New,
  /** 寻找旧页面，node.active=true */
  Old,
}

/** 节点状态 */
enum PanelState {
  /** 打开状态 */
  Open,
  /** 关闭状态 */
  Close,
}

interface PanelContext {
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
  state: PanelState;
}

/** 父节点 */
let parent: cc.Node;

/** 当前节点的node.zIndex */
let now_z_index = 0;

/** 界面脚本的实现基类
 * @since 1.0.0
 * @example
  &#64;DE_SET_PANEL_CONTEXT("PanelExample", "Old", 0)
  export class PanelExample extends PanelBase {
    async on_create(): Promise<void> {}
    async on_open(): Promise<void> {}
    async on_close(): Promise<void> {}
  }
 */
export abstract class PanelBase extends cc.Component {
  /** 界面的上下文信息 */
  static context: PanelContext;
  /** 界面首次打开执行函数，处理只执行1次的逻辑，比如创建 */
  abstract async on_create(): Promise<void>;
  /** 界面打开函数，处理动画和逻辑，会在onLoad之后，start之前执行 */
  abstract async on_open(...params: unknown[]): Promise<void>;
  /** 界面关闭函数，处理动画和逻辑，会在onDestroy之前执行 */
  abstract async on_close(...params: unknown[]): Promise<void>;
}

/**
 * 设置panel类上下文的装饰器
 * @since 1.0.0
 * @param config
 */
export function DE_SET_PANEL_CONTEXT(
  path: string,
  type: keyof typeof PanelType = "Old",
  z_index_base = 0,
) {
  return (constructor: typeof PanelBase): void => {
    constructor.context = {
      path: path,
      z_index_base: z_index_base,
      type: PanelType[type],
      prefab: undefined,
      ins: undefined,
      state: PanelState.Close,
    };
  };
}

/**
 * 初始化系统，传入父节点
 * @since 1.0.0
 * @param node
 */
export function _init_panel(node: cc.Node = new cc.Node()): void {
  parent = node;
}

/**
 * 预载入界面prefab
 * @since 1.0.0
 * @param panel
 */
export async function pre_panel(panel: typeof PanelBase): Promise<void> {
  if (!panel.context.prefab) {
    panel.context.prefab = await load_res_async(panel.context.path, cc.Prefab);
  }
}

/**
 * 获取界面实例，如果获取不到，则创建新的
 * @since 1.0.0
 * @param panel
 */
async function get_panel(panel: typeof PanelBase) {
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
 * @since 1.0.0
 * @param panel
 * @param params
 */
export async function open_panel<T extends typeof PanelBase>(
  panel: T,
  ...params: Parameters<T["prototype"]["on_open"]>
): Promise<void> {
  // 校验
  if (panel.context.state === PanelState.Open) {
    return;
  } else {
    panel.context.state = PanelState.Open;
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
 * @since 1.0.0
 * @param panel
 * @param params
 */
export async function close_panel<T extends typeof PanelBase>(
  panel: T,
  ...params: Parameters<T["prototype"]["on_close"]>
): Promise<void> {
  // 校验
  if (panel.context.state === PanelState.Close) {
    return;
  } else {
    panel.context.state = PanelState.Close;
  }
  // 删除实例
  await panel.context.ins.on_close(...params);
  if (panel.context.type === PanelType.New) {
    panel.context.ins.node.destroy();
    panel.context.ins = undefined;
  } else if (panel.context.type === PanelType.Old) {
    panel.context.ins.node.active = false;
  }
}
