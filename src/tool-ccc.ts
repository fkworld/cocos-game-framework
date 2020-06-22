/**
 * 工具函数模块
 * - 与cocos creator相关的函数
 * @see https://www.yuque.com/fengyong/game-develop-road/ah2ypi
 */

import { log, LogLevel } from "./log";

/**
 * 适配canvas
 * - cc.winSize只有在适配后才能获取到正确的值，因此需要使用cc.getFrameSize来获取初始的屏幕大小
 * @since 1.0.0
 * @param canvas
 */
export function adjust_canvas(canvas: cc.Canvas): void {
  let screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
  let design_size = canvas.designResolution.width / canvas.designResolution.height;
  let f = screen_size >= design_size;
  canvas.fitHeight = f;
  canvas.fitWidth = !f;
}

/**
 * 刷新给定节点的widget
 * @since 1.0.0
 * @param node
 */
export function do_widget(node: cc.Node): void {
  let w = node.getComponent(cc.Widget);
  if (w && w.enabled) {
    w.updateAlignment();
    if (
      w.alignMode === cc.Widget.AlignMode.ONCE ||
      w.alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE
    ) {
      w.enabled = false;
    }
  }
}

/**
 * 刷新给定节点下所有的widget
 * @since 1.0.0
 * @param node
 */
export function do_widget_all(node: cc.Node): void {
  node.getComponentsInChildren(cc.Widget).forEach(w => do_widget(w.node));
}

/**
 * schedule/scheduleOnce的封装
 * - 使用cc.Tween实现
 * - 使用cc.Tween.stopAllByTarget方法来取消
 * @since 1.0.0
 * @param target
 * @param interval 执行间隔，单位为s。
 * @param count 重复次数，包括首次。如果为0，则表示一直重复，此时会直接抛出res。
 * @param is_first 是否在启动时执行首次
 * @param f
 */
export async function do_schedule(
  target: Record<string, unknown>,
  interval: number,
  count: number,
  is_first: boolean,
  f: (index: number) => void,
): Promise<void> {
  return new Promise(res => {
    let index = 0;
    let f_fix = () => {
      f(index);
      index += 1;
    };
    if (is_first) {
      f_fix();
      count -= 1;
    }
    if (count <= 0) {
      res();
      cc.tween(target).delay(interval).call(f_fix).union().repeatForever().start();
    } else {
      cc.tween(target).delay(interval).call(f_fix).union().repeat(count).call(res).start();
    }
  });
}

/**
 * 获取节点的世界坐标
 * @since 1.0.0
 * @param node
 */
export function get_node_wp(node: cc.Node): cc.Vec3 {
  return node.convertToWorldSpaceAR(cc.Vec3.ZERO);
}

/**
 * 根据世界坐标设置节点本地坐标
 * @since 1.0.0
 * @param node
 * @param wp
 * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
 */
export function set_node_by_wp(node: cc.Node, wp: cc.Vec3, flag = false): cc.Vec3 {
  let lp = node.parent.convertToNodeSpaceAR(wp);
  flag && (node.position = lp);
  return lp;
}

/**
 * 载入单个资源
 * @since 1.0.0
 * @param resources
 */
export async function load_async(
  resources: string | string[] | { type: "uuid"; uuid?: string; url?: string },
): Promise<any> {
  return new Promise(res => {
    cc.loader.load(resources, (err: unknown, r: unknown) => {
      err && log(LogLevel.Error, `载入资源失败，resources=${resources}，err=${err}`);
      err ? res() : res(r);
    });
  }).catch(err => {
    log(LogLevel.Error, `载入资源失败，resources=${resources}，err=${err}`);
  });
}

/**
 * 载入resources下的单个资源
 * - 统一在运行时载入和在编辑器中载入
 * - 如果无此资源，则报错并返回undefined
 * @since 1.0.0
 * @param path 资源路径，以运行时路径为准
 * @param type
 */
export async function load_res_async<T extends typeof cc.Asset>(
  path: string,
  type: T,
): Promise<InstanceType<T>> {
  if (CC_EDITOR) {
    // 在编辑器中载入
    let url = to_editor_url(path);
    // 针jpg和png资源完善路径
    if (new cc.SpriteFrame() instanceof type) {
      url = (cc.path.join as any)(url, get_filename(url));
    }
    let uuid = Editor.assetdb.remote.urlToUuid(url);
    return load_async({ type: "uuid", uuid: uuid });
  } else {
    // 运行时载入
    return new Promise(res => {
      // 去除后缀名
      let url = cc.path.mainFileName(path);
      cc.loader.loadRes(url, type, (err, r) => {
        err && log(LogLevel.Error, `载入资源失败, path=${url}, err=${err}`);
        err ? res() : res(r);
      });
    });
  }
}

/**
 * 载入resources下某个文件夹下的所有资源
 * - 不同平台下的载入顺序不同，因此在载入完毕后需要进行排序
 * @since 1.0.0
 * @param path
 * @param type
 */
export async function load_res_dir_async<T extends typeof cc.Asset>(
  path: string,
  type: T,
): Promise<InstanceType<T>[]> {
  return new Promise(res => {
    cc.loader.loadResDir(path, type, (err, r) => {
      err && log(LogLevel.Error, `载入资源组失败, path=${path}, err=${err}`);
      err ? res() : res(r);
    });
  });
}

/* eslint-disable @typescript-eslint/naming-convention */
// cc.Intersection
export const {
  lineLine,
  lineRect,
  linePolygon,
  rectRect,
  rectPolygon,
  polygonCircle,
  polygonPolygon,
  circleCircle,
  pointInPolygon,
  pointLineDistance,
} = cc.Intersection;
export function pointInCircle(
  point: cc.Vec2,
  circle: {
    position: cc.Vec2;
    radius: number;
  },
): boolean {
  return point.sub(circle.position).len() <= circle.radius;
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * 获取无后缀的文件名
 * @since 1.0.0
 * @param path
 */
export function get_filename(path: string): void {
  return cc.path.basename("/" + path, cc.path.extname(path));
}

/**
 * 将resources下的路径转为编辑器url
 * @since 1.0.0
 * @param resources_path
 */
export function to_editor_url(path: string): string {
  return (cc.path.join as any)("db://assets/resources/", path);
}

/**
 * 获取子节点
 * - 使用cc.find获取子节点
 * @since 1.0.0
 * @param n
 * @param childs 子节点类型
 * @param childs_path 子节点路径
 */
export function get_node_childs<T extends { [k: string]: typeof cc.Node | typeof cc.Component }>(
  n: cc.Node,
  childs: T,
  childs_path: Partial<Record<keyof T, string>> = {},
): TypeChilds<T> {
  let r = { self: n };
  Object.entries(childs).forEach(([k, v]) => {
    let path = childs_path[k] || k;
    let child_node = cc.find(path, n);
    if (!child_node) {
      log(LogLevel.Error, "获取子节点失败，path=", path);
      r[k] = child_node;
      return;
    }
    r[k] = v === cc.Node ? child_node : child_node.getComponent(v as any);
  });
  return r as any;
}

/**
 * 子节点类型
 */
export type TypeChilds<T extends { [k: string]: typeof cc.Node | typeof cc.Component }> = {
  [k in keyof T]: T[k] extends typeof cc.Component ? InstanceType<T[k]> : cc.Node;
} & {
  self: cc.Node;
};
