/**
 * 工具函数模块
 * - 与cocos creator相关的函数
 */

import { log, LogLevel } from "./log";

/**
 * 适配canvas
 * - 【注意】cc.winSize只有在适配后才能获取到正确的值，因此需要使用cc.getFrameSize来获取初始的屏幕大小
 * @param canvas
 */
export function adjust_canvas(canvas: cc.Canvas) {
  let screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
  let design_size = canvas.designResolution.width / canvas.designResolution.height;
  let f = screen_size >= design_size;
  canvas.fitHeight = f;
  canvas.fitWidth = !f;
}

/**
 * 刷新给定节点的widget
 * @param node
 */
export function do_widget(node: cc.Node) {
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
 * @param node
 */
export function do_widget_all(node: cc.Node) {
  node.getComponentsInChildren(cc.Widget).forEach(w => do_widget(w.node));
}

/**
 * schedule/scheduleOnce的封装
 * - 使用cc.Tween实现
 * - 使用cc.Tween.stopAllByTarget方法来取消
 * @param target
 * @param interval 执行间隔，单位为s。
 * @param count 重复次数，包括首次。如果为0，则表示一直重复，此时会直接抛出res。
 * @param is_first 是否在启动时执行首次
 * @param f
 */
export async function do_schedule(
  target: object,
  interval: number,
  count: number,
  is_first: boolean,
  f: (index: number) => void,
) {
  return new Promise(res => {
    let index = 0;
    let do_f = () => {
      f(index);
      index += 1;
    };
    if (is_first) {
      do_f();
      count -= 1;
    }
    if (count <= 0) {
      res();
      cc.tween(target).delay(interval).call(do_f).union().repeatForever().start();
    } else {
      cc.tween(target).delay(interval).call(do_f).union().repeat(count).call(res).start();
    }
  });
}

/**
 * 获取节点的世界坐标
 * @param node
 */
export function get_node_wp(node: cc.Node): cc.Vec3 {
  return node.convertToWorldSpaceAR(cc.Vec3.ZERO);
}

/**
 * 根据世界坐标设置节点本地坐标
 * @param node
 * @param wp
 * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
 */
export function set_node_by_wp(node: cc.Node, wp: cc.Vec3, flag = false) {
  let lp = node.parent.convertToNodeSpaceAR(wp);
  flag && (node.position = lp);
  return lp;
}

/**
 * 载入单个资源
 * - 一般用于已知uuid的载入
 * @description cc.loader.load
 * @param resources
 */
export async function load(
  resources: string | string[] | { type: "uuid"; uuid?: string; url?: string },
): Promise<any> {
  return new Promise(res => {
    cc.loader.load(resources, (err: any, r: any) => {
      err && log(LogLevel.ERROR, `载入资源失败，resources=${resources}，err=${err}`);
      err ? res() : res(r);
    });
  }).catch(err => {
    log(LogLevel.ERROR, `载入资源失败，resources=${resources}，err=${err}`);
  });
}

/**
 * 载入resources下的单个资源
 * - 统一在运行时载入和在编辑器中载入
 * - 如果无此资源，则报错并返回undefined
 * @param path 资源路径，以运行时路径为准
 * @param type
 */
export async function load_res<T extends typeof cc.Asset>(
  path: string,
  type: T,
): Promise<InstanceType<T>> {
  if (CC_EDITOR) {
    let url = to_editor_url(path);
    // 针jpg和png资源完善路径
    if (new cc.SpriteFrame() instanceof type) {
      // cc.path.join的声明有错误，需要使用as any修正
      url = (cc.path.join as any)(url, get_filename(url));
    }
    let uuid = Editor.assetdb.remote.urlToUuid(url);
    return load({ type: "uuid", uuid: uuid });
  } else {
    return new Promise(res => {
      // 运行时载入
      path = cc.path.mainFileName(path);
      cc.loader.loadRes(path, type, (err, r) => {
        err && log(LogLevel.ERROR, `载入资源失败, path=${path}, err=${err}`);
        err ? res() : res(r);
      });
    });
  }
}

/**
 * 载入resources下某个文件夹下的所有资源
 * - 不同平台下的载入顺序不同，因此在载入完毕后需要进行排序
 * @param path
 * @param type
 */
export async function load_res_dir<T extends typeof cc.Asset>(
  path: string,
  type: T,
): Promise<InstanceType<T>[]> {
  return new Promise(res => {
    cc.loader.loadResDir(path, type, (err, r) => {
      err && log(LogLevel.ERROR, `载入资源组失败, path=${path}, err=${err}`);
      err ? res() : res(r);
    });
  });
}

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
export function pointInCircle(point: cc.Vec2, circle: CCCCircle) {
  return point.sub(circle.position).len() <= circle.radius;
}

/** 在ccc中表示一个圆 */
export interface CCCCircle {
  position: cc.Vec2;
  radius: number;
}

/**
 * 获取无后缀的文件名
 * @param path
 */
export function get_filename(path: string) {
  return cc.path.basename("/" + path, cc.path.extname(path));
}

/**
 * 将 resources 下的路径转为编辑器 url
 * @param resources_path
 */
export function to_editor_url(path: string) {
  return (cc.path.join as any)("db://assets/resources/", path);
}
