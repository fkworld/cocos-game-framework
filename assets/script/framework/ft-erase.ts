import { G } from "./f-global";
import { FMLog } from "./fm-log";

const { ccclass, property, requireComponent } = cc._decorator;
const C = {
    /** 默认擦除半径 */
    R: 25,
    /** 默认擦除回调完成比例 */
    RATIO: 0.95,
    /** 默认的擦除间隔，单位是r的倍数 */
    SPACE: 0.2,
    /** 最大擦除间隔数 */
    MAX_COUNT: 10,
}
Object.freeze(C)

/**
 * [framework-T] 橡皮擦效果实现
 * - 使用cc.Mask的_graphics组件实现擦除效果
 * - 新建像素点数组来记录擦除点，实现擦除完成后的回调方法
 * - 注意：之前版本的creator中cc.Mask有bug（在GitHub上已经修复），建议使用2.0.5以上版本，或者使用修复引擎功能修复
 * - 注意：考虑有限像素存储
 * @example 新建一个节点，节点大小为0，拖入FTErase组件，会自动补充cc.Mask组件并调整参数，在此节点下的图片是被擦除部分
 * @todo 性能优化
 * @todo 完全像素存储->间隔像素存储，即使用300-300个像素来表示600-600个像素
 */
@ccclass
@requireComponent(cc.Mask)
export class FFTErase extends cc.Component {

    /**
     * 获取节点的对应组件
     * @param node 
     * @static
     */
    static get(node: cc.Node): FFTErase { return node.getComponent(FFTErase) }

    onLoad() {
        // 初始化mask
        this.mask = this.node.getComponent(cc.Mask)
        this.mask.type = cc.Mask.Type.RECT
        this.mask.inverted = true
        // 初始化g
        this.g = this.mask['_graphics']
        // 初始化触摸事件
        if (this.is_auto_touch) { this.set_touch_event() }
    }

    update() {
        this.g.fill()
        this.do_finish_f()
    }

    @property({ tooltip: '触摸区域', type: cc.Node })
    touch_area: cc.Node = null

    @property({ tooltip: '是否记录擦除点（如果记录，则可以解锁擦除进度功能，但是相应的会一定程度的影响性能）' })
    is_save: boolean = true

    @property({ tooltip: '是否自动触摸擦除' })
    is_auto_touch: boolean = true

    @property({ tooltip: '如果自动触摸擦除，擦除半径是' })
    erase_r: number = C.R

    /** cc.Mask组件 */
    mask: cc.Mask
    /** cc.Mask组件中的graphics实现 */
    g: cc.Graphics
    /** 记录已经修改的点 */
    array_save = {}
    /** 保存touch点，start */
    p_start: cc.Vec2
    /** 保存touch点，end */
    p_end: cc.Vec2
    /** 完成回调数组 */
    array_finish_f: ControllerFinish[] = []

    /**
     * 设置点击事件
     * - 为了解决触摸溢出，则需要放一个超过Mask大小的touch_area
     */
    set_touch_event() {
        /** touch start 逻辑 */
        const f_start = (e: cc.Touch) => {
            this.p_start = this.node.convertToNodeSpaceAR(e.getLocation())
            this.draw_circle(this.p_start, this.erase_r)
        }
        /** touch move逻辑 */
        const f_move = (e: cc.Touch) => {
            this.p_end = this.node.convertToNodeSpaceAR(e.getLocation())
            this.draw_many_circle(this.p_start, this.p_end, this.erase_r)
            this.p_start = this.p_end
        }
        /** touch end & cancel 逻辑 */
        const f_end_cancel = (e: cc.Touch) => {
            // 
        }
        this.touch_area.on(cc.Node.EventType.TOUCH_START, (e: cc.Touch) => { f_start(e) })
        this.touch_area.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Touch) => { f_move(e) })
        this.touch_area.on(cc.Node.EventType.TOUCH_END, (e: cc.Touch) => { f_end_cancel(e) })
        this.touch_area.on(cc.Node.EventType.TOUCH_CANCEL, (e: cc.Touch) => { f_end_cancel(e) })
    }

    /**
     * 绘制一个圆形的擦除区域
     * @param p 
     * @param r 
     */
    draw_circle(p: cc.Vec2, r: number = C.R) {
        // 绘制（绘制路径但是不填充，在update中统一填充）
        this.g.circle(p.x, p.y, r)
        // 记录点
        if (this.is_save) {
            // 整数化
            p.x = Math.trunc(p.x)
            p.y = Math.trunc(p.y)
            r = Math.trunc(r)
            // 遍历点
            for (let x = p.x - r; x <= p.x + r; x += 1) {
                for (let y = p.y - r; y <= p.y + r; y += 1) {
                    // 点已被改写，则跳过
                    if (this.array_save[`${x}-${y}`] != undefined) { continue }
                    // 点在圆外，则跳过
                    if (G.get_p_p_distance(p, cc.v2(x, y)) > r) { continue }
                    // 改写点
                    this.array_save[`${x}-${y}`] = 1
                    // 将点记录到rect中
                    for (let cfinish of this.array_finish_f) { cfinish.save(cc.v2(x, y)) }
                }
            }
        }
    }

    /**
     * 绘制两点之间的多个圆
     * @param p0 
     * @param p1 
     * @param r 
     */
    draw_many_circle(p0: cc.Vec2, p1: cc.Vec2, r: number = C.R, space: number = C.SPACE) {
        // 计算间隔数
        let count = Math.min(C.MAX_COUNT, G.get_p_p_distance(p0, p1) / (r * space))
        // 根据间隔数绘制圆
        for (let i = 0; i < count; i += 1) {
            let p = p0.lerp(p1, (i + 1) / count)
            this.draw_circle(p, r)
        }
    }

    /** 检查是否开启近路功能 */
    check_save() {
        if (!this.is_save) { FMLog.error(`@FFTErase: 记录功能未开启，无法实现完成回调功能，已自动开启，请检查node=${this.node}`) }
        this.is_save = true
    }

    /**
     * 设置区域擦除完毕后的执行方法；传入rect来描述区域
     * @param rect 区域描述
     * @param f 执行方法
     * @param ratio 判断擦除完毕的比例
     */
    set_finish_f_by_rect(rect: cc.Rect, f: Function, ratio: number = C.RATIO) {
        this.check_save()
        this.array_finish_f.push(new ControllerFinish(rect, f, ratio))
    }

    /**
     * 设置区域擦除完毕后的执行方法；传入center、width、height来描述区域
     * @param p_center
     * @param width 
     * @param height 
     * @param f 
     * @param ratio 
     */
    set_finish_f_by_center(p_center: cc.Vec2, width: number, height: number, f: Function, ratio: number = C.RATIO) {
        this.check_save()
        this.array_finish_f.push(new ControllerFinish(cc.rect(p_center.x - width / 2, p_center.y - height / 2, width, height), f, ratio))
    }

    /** 执行完成回调 */
    do_finish_f() {
        for (let cfinish of this.array_finish_f) { cfinish.do() }
    }

    /** 重置 */
    reset() {
        this.g.clear()
        this.array_save = {}
        for (let cfinish of this.array_finish_f) { cfinish.reset() }
    }

    /**
     * 渐隐擦除内容
     * @param time 渐隐时间，默认0.2s
     */
    hide(time: number = 0.2) {
        this.mask.node.runAction(cc.fadeOut(time))
    }
}

/**
 * 完成回调控制器
 */
class ControllerFinish {

    /**
     * 构造函数
     * @param rect 完成区域（不进行二次验证，需要保证其在擦除区域内）
     * @param f 完成方法
     * @param ratio 完成比例
     */
    constructor(rect: cc.Rect, f: Function, ratio: number) {
        this.rect = rect
        this.f = f
        this.ratio = ratio
        this.all_count = rect.width * rect.height
        this.is_over = false
        this.finish_count = 0
    }

    /** 区域描述 */
    rect: cc.Rect
    /** 执行函数 */
    f: Function
    /** 完成比例 */
    ratio: number
    /** 是否执行完毕 */
    is_over: boolean
    /** 点修改计数 */
    finish_count: number
    /** 点总计数 */
    all_count: number

    /**
     * 执行
     * - 包括执行前置判定
     */
    do() {
        // 不满足执行条件
        if (this.is_over) { return }
        if (this.finish_count / this.all_count < this.ratio) { return }
        // 满足执行条件
        this.is_over = true
        this.f()
    }

    /**
     * 保存区域内点的变化
     * @param p 
     */
    save(p: cc.Vec2) {
        if (this.rect.contains(p)) { this.finish_count += 1 }
    }

    /** 重置 */
    reset() {
        this.is_over = false
        this.finish_count = 0
    }
}