/** 事件中心 */
export declare const event_center: cc.EventTarget;
/**
 * 监听事件，直到某个条件成功后，不再监听此事件
 * @param event
 * @param f_is
 * @param f_success
 */
export declare const on_success_once_event: (event: string, f_is: Function, f_success: Function) => void;
