// cocos creator 相关逻辑

import { TAG } from "./tool";

/**
 * 适配 canvas
 * - 【注意】cc.winSize 只有在适配后才能获取到正确的值，因此需要使用 cc.getFrameSize 来获取初始的屏幕大小
 * @param canvas
 */
export const adjust_canvas = (canvas: cc.Canvas) => {
  let screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
  let design_size = canvas.designResolution.width / canvas.designResolution.height;
  let f = screen_size >= design_size;
  canvas.fitHeight = f;
  canvas.fitWidth = !f;
};

/**
 * 刷新给定节点的widget
 * @param node
 */
export const do_widget = (node: cc.Node) => {
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
};

/**
 * 刷新给定节点下所有的widget
 * @param node
 */
export const do_widget_all = (node: cc.Node) => {
  node.getComponentsInChildren(cc.Widget).forEach(w => do_widget(w.node));
};

/**
 * 间隔帧执行
 * @param f 执行函数
 * @param all_count 总计数
 * @param interval 间隔帧；默认为1，表示连续执行
 * @param target 执行组件
 */
export const do_with_frame = async (
  f: (index: number) => void,
  all_count: number,
  interval: number,
  target: cc.Component
) => {
  await new Promise(res => {
    let count = (all_count - 1) * interval; // 执行总帧数
    let frame_index = 0; // 帧index
    let f_index = 0; // 函数执行index
    target.schedule(
      () => {
        if (frame_index % interval === 0) {
          f(f_index);
          f_index += 1;
        }
        frame_index += 1;
        frame_index > count && res();
      },
      0,
      count
    );
  });
};

/**
 * 获取节点的世界坐标
 * @param node
 */
export const get_node_wp = (node: cc.Node): cc.Vec3 => {
  return node.convertToWorldSpaceAR(cc.Vec3.ZERO);
};

/**
 * 根据世界坐标设置节点本地坐标
 * @param node
 * @param wp
 * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
 */
export const set_node_by_wp = (node: cc.Node, wp: cc.Vec3, flag = false) => {
  let lp = node.parent.convertToNodeSpaceAR(wp);
  flag && (node.position = lp);
  return lp;
};

/**
 * 载入单个资源
 * - 既可以在editor中载入，也可以在运行时载入，但载入方式有差异
 * - 如果无此资源，则报错并返回null
 * - 【注意】运行时载入时无需传入文件后缀名，编辑器中载入需要有后缀名
 * - 【注意】在编辑器中载入
 * @param path
 * @param type
 */
export const load_res = async <T extends typeof cc.Asset>(
  path: string,
  type: T
): Promise<InstanceType<T>> => {
  return await new Promise(res => {
    if (CC_EDITOR) {
      // 在编辑器中载入
      let url = `db://assets/resources/${path}`;
      // 针jpg和png资源完善路径
      if (new cc.SpriteFrame() instanceof type) {
        // cc.path.join 的声明有错误，需要使用 as any 修正
        url = (cc.path.join as any)(url, get_filename(url));
      }
      let uuid = Editor.assetdb.remote.urlToUuid(url);
      cc.loader.load({ type: "uuid", uuid: uuid }, (err: any, resource: any) => {
        err && cc.warn(TAG, `载入资源失败, path=${path}, err=${err}`);
        err ? res(null) : res(resource);
      });
    } else {
      // 运行时载入
      // 后缀名处理：去掉后缀名
      path = cc.path.mainFileName(path);
      cc.loader.loadRes(path, type, (err, resource) => {
        err && cc.warn(TAG, `载入资源失败, path=${path}, err=${err}`);
        err ? res(null) : res(resource);
      });
    }
  });
};

/**
 * 载入dir资源
 * - 【注意】编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
 * @param path
 * @param type
 */
export const load_res_dir = async <T extends typeof cc.Asset>(
  path: string,
  type: T
): Promise<InstanceType<T>[]> => {
  return await new Promise(res => {
    cc.loader.loadResDir(path, type, (err, resource) => {
      err && cc.warn(TAG, `载入资源组失败, path=${path}, err=${err}`);
      err ? res(null) : res(resource);
    });
  });
};

// cc.Intersection
export const lineLine = cc.Intersection.lineLine;
export const lineRect = cc.Intersection.lineRect;
export const linePolygon = cc.Intersection.linePolygon;
export const rectRect = cc.Intersection.rectRect;
export const rectPolygon = cc.Intersection.rectPolygon;
export const polygonPolygon = cc.Intersection.polygonPolygon;
export const polygonCircle = cc.Intersection.polygonCircle;
export const circleCircle = cc.Intersection.circleCircle;
export const pointInPolygon = cc.Intersection.pointInPolygon;
export const pointLineDistance = cc.Intersection.pointLineDistance;
export const pointInCircle = (point: cc.Vec2, circle: CCCCircle) =>
  point.sub(circle.position).len() <= circle.radius;

/** 在 ccc 中表示一个圆 */
export interface CCCCircle {
  position: cc.Vec2;
  radius: number;
}

/**
 * 获取无后缀的文件名
 * @param path
 */
export const get_filename = (path: string) => cc.path.basename(path, cc.path.extname(path));
