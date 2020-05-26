/**
 * 事件模块
 * - 使用cc.EventTarget实现
 */

/** 事件中心 */
export const event_center = new cc.EventTarget();

/**
 * 监听事件，直到某个条件成功后，不再监听此事件
 * @param event
 * @param f_is
 * @param f_success
 */
export const on_success_once_event = (event: string, f_is: Function, f_success: Function) => {
  let v = {};
  event_center.on(
    event,
    () => {
      if (f_is()) {
        event_center.targetOff(v);
        f_success();
      }
    },
    v
  );
};
