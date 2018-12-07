const { ccclass, property, requireComponent } = cc._decorator;
const C = {
    /** 默认擦除半径 */
    R: 25,
    /** 默认擦除回调完成比例 */
    RATIO: 0.95,
    /** 像素状态；使用像素的alpha代替 */
    PIXEL_STATE: {
        EMPTY: 0,
        FULL: 255,
    },
}
Object.freeze(C)

/**
 * [framework-T] 橡皮擦效果实现
 * - 通过动态修改mask图片的像素来实现
 * - 单点画圆，多点画直线
 * - [注意] 图片的像素数组从左上角开始
 * - [注意] 节点的width和height最好为整数
 * - [注意] 由于像素和坐标的对应关系有偏差，因此擦除进度无法达到100%
 * - 完成回调实现逻辑：使用一系列参数确定一个完成回调；包括：区域描述，回调方法，执行次数，执行间隔；写入计数，总计数，是否完成
 */
@ccclass
@requireComponent(cc.Mask)
export class TErase extends cc.Component {

    /**
     * 获取节点的对应组件
     * @param node 
     * @static
     */
    static get(node: cc.Node): TErase {
        return node.getComponent(TErase)
    }

    onLoad() {
        this.init_mask()
        this.init_array_pixel()
        if (this.is_auto_touch) { this.set_touch_event() }
    }

    start() {
        this.draw_mask()
    }

    update() {
        // 更改机制：考虑实际使用过程中的多点触摸，由触发式重绘改成帧重绘
        // 目前是单帧重；如果依然有性能压力，则可以改为间隔帧重绘
        if (this.change_flag) {
            this.change_flag = false
            this.draw_mask()
            this.do_finish_f()
        }
    }

    /** 触摸区域（建议大于mask区域） */
    @property(cc.Node)
    touch_area: cc.Node = null

    /** 是否自动设置touch事件 */
    @property()
    is_auto_touch: boolean = true

    /** cc.Mask组件 */
    mask: cc.Mask

    get width() { return this.node.width }
    get height() { return this.node.height }

    /** 源像素数组；从左上角开始；每个像素用4个数值描述 */
    array_pixel_source: Uint8Array

    /** 简化像素数组；同源像素数组，但是不包含像素的RGB信息，每个像素用1个数值描述 */
    array_pixel_simplify: number[] = []

    /** 是否更改 */
    change_flag: boolean = false

    /** 保存touch点，start */
    p_start: cc.Vec2

    /** 保存touch点，end */
    p_end: cc.Vec2

    /** 完成回调 */
    array_finish_f: FInfo[] = []

    /**
     * 设置点击事件
     * - 为了解决触摸溢出，则需要放一个超过Mask大小的touch_area
     */
    set_touch_event(n: cc.Node = this.touch_area) {
        n.on(cc.Node.EventType.TOUCH_START, (e: cc.Touch) => {
            // 保存起点
            this.p_start = this.node.convertToNodeSpaceAR(e.getLocation())
            // 起点触摸draw circle
            this.draw_circle(this.p_start)
        })
        n.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Touch) => {
            // 保存临时点
            this.p_end = this.node.convertToNodeSpaceAR(e.getLocation())
            // draw line
            this.draw_circle_line(this.p_start, this.p_end)
            // 修改存储
            this.p_start = this.p_end
        })
        n.on(cc.Node.EventType.TOUCH_END || cc.Node.EventType.TOUCH_CANCEL, (e: cc.Touch) => {
            // 
        })
    }

    /**
     * 初始化mask组件
     */
    init_mask() {
        this.mask = this.node.getComponent(cc.Mask)
        this.mask.type = cc.Mask.Type.IMAGE_STENCIL
        this.mask.alphaThreshold = 0
    }

    /**
     * 初始化像素数组
     */
    init_array_pixel() {
        let array = []
        for (let i = 0; i < this.node.width * this.node.height; i++) {
            array.push(0, 0, 0, C.PIXEL_STATE.FULL)
        }
        this.array_pixel_simplify.length = this.node.width * this.node.height
        this.array_pixel_simplify.fill(C.PIXEL_STATE.FULL)
        this.array_pixel_source = new Uint8Array(array)
    }

    /**
     * 绘制新的图像并赋值给mask
     * - 使用cocos creator中spriteFrame的属性_texture；此属性不在公共API中
     * @param array_pixel 像素点数组
     */
    draw_mask(array_pixel: Uint8Array = this.array_pixel_source) {
        // 删除原有的
        if (this.mask.spriteFrame) { this.mask.spriteFrame.destroy() }
        if (this.mask.spriteFrame && this.mask.spriteFrame['_texture']) { this.mask.spriteFrame['_texture'].destroy() }
        // 创建新的
        let rt = new cc.RenderTexture()
        rt.initWithSize(this.node.width, this.node.height)
        rt.initWithData(array_pixel, 16, this.node.width, this.node.height)
        this.mask.spriteFrame = new cc.SpriteFrame(rt)
    }

    /**
     * 修改单个像素
     * - 修改像素透明度
     * - 修改实例化的this.array_pixel_simplify，this.array_pixel_source，
     * - 处理id溢出情况：不进行溢出id绘制
     * - 返回true表示有修改，false表示无修改
     * @param p 
     */
    change_single_pixel(p: cc.Vec2): boolean {
        const pixel_id = this.trans_p_to_pixel_id(p)
        // id溢出处理
        if (pixel_id < 0 || pixel_id >= this.array_pixel_simplify.length) { return false }
        // 无改动处理
        if (this.array_pixel_simplify[pixel_id] === C.PIXEL_STATE.EMPTY) { return false }
        // 更改存储数值
        this.array_pixel_simplify[pixel_id] = C.PIXEL_STATE.EMPTY
        this.array_pixel_source[pixel_id * 4 + 3] = C.PIXEL_STATE.EMPTY
        // 判断是否修改了区域内的点
        for (let finfo of this.array_finish_f) {
            finfo.save_change(p, pixel_id)
        }
        return true
    }

    /**
     * 绘制多个点
     * @param array_p 要绘制的点数组
     */
    draw_array_point(array_p: cc.Vec2[]) {
        // 更改存储
        let change_flag = false
        for (let p of array_p) {
            let flag = this.change_single_pixel(p)
            change_flag = change_flag || flag
        }
        // 如果无更改，则直接return
        if (!change_flag) { return }
        // 有更改则修改flag，进行重绘
        this.change_flag = true
    }

    /**
     * 根据点p更改一个圆形内所有的像素点
     * @param p 
     * @param r 
     */
    draw_circle(p: cc.Vec2, r = C.R) {
        // 计算点
        let array_result = []
        for (let x = p.x - r; x <= p.x + r; x++) {
            for (let y = p.y - r; y <= p.y + r; y++) {
                if (TErase.cal_p0_p1_distance(cc.v2(x, y), p) <= r) {
                    array_result.push(cc.v2(x, y))
                }
            }
        }
        // 绘制点
        this.draw_array_point(array_result)
    }

    draw_circle_line(p0: cc.Vec2, p1: cc.Vec2, r = C.R) {
        // 计算点
        let min_p = cc.v2(Math.min(p0.x, p1.x) - r, Math.min(p0.y, p1.y) - r)
        let max_p = cc.v2(Math.max(p0.x, p1.x) + r, Math.max(p0.y, p1.y) + r)
        let array_result = []
        for (let x = min_p.x; x <= max_p.x; x++) {
            for (let y = min_p.y; y <= max_p.y; y++) {
                if (TErase.cal_p_line_distance(cc.v2(x, y), p0, p1) <= r) {
                    array_result.push(cc.v2(x, y))
                }
            }
        }
        // 绘制点
        this.draw_array_point(array_result)
    }

    /**
     * 将多个p重置为整数
     * @param p 
     */
    static reset_p(...p: cc.Vec2[]) {
        for (let i = 0; i < p.length; i++) {
            p[i].x = Math.round(p[i].x)
            p[i].y = Math.round(p[i].y)
        }
    }

    /**
     * 计算点p0到p1的距离
     * - 有开平方计算，可能会造成性能损耗；未来可能会替换成magSqr()
     * @param p0 
     * @param p1 
     */
    static cal_p0_p1_distance(p0: cc.Vec2, p1: cc.Vec2): number {
        return p0.sub(p1).mag()
    }

    /**
     * 计算点p到一条线段的最短距离
     * - 线段并非直线，如果在线段外，则返回到某一个端点的距离
     * - 算法抄的，我也不知道为啥这样算
     * @param p 
     * @param p0 
     * @param p1 
     */
    static cal_p_line_distance(p: cc.Vec2, p0: cc.Vec2, p1: cc.Vec2): number {
        // 计算交点坐标
        let p_intersection;
        if (p0.x === p1.x) {
            p_intersection = cc.v2(p0.x, p.y)
        } else {
            let A = (p0.y - p1.y) / (p0.x - p1.x)
            let B = p0.y - A * p0.x
            let m = p.x + A * p.y
            p_intersection = cc.v2((m - A * B) / (A * A + 1), A * (m - A * B) / (A * A + 1) + B)
        }
        // 判断交点是否在线段上，计算点到线段的最短距离
        if (
            p_intersection.x >= Math.min(p0.x, p1.x)
            && p_intersection.x <= Math.max(p0.x, p1.x)
            && p_intersection.y >= Math.min(p0.y, p1.y)
            && p_intersection.y <= Math.max(p0.y, p1.y)
        ) {
            return p.sub(p_intersection).mag()
        } else {
            return Math.min(p.sub(p0).mag(), p.sub(p1).mag())
        }
    }

    /**
     * 将坐标转换为像素数组的id
     * - [注意] 节点坐标以节点中心点为基准
     * - [注意] 因为像素没有小数，因此会对节点坐标进行整数化处理；Math.floor()
     * - [注意] 像素id从左上开始，从0开始，单个id的像素由4个数值组成
     * @param p 坐标
     * @param width 横向像素个数
     * @param height 纵向像素个数
     */
    trans_p_to_pixel_id(p: cc.Vec2, width: number = this.node.width, height: number = this.node.height): number {
        let col = Math.floor(width / 2 + p.x)
        let row = Math.floor(height / 2 - p.y)
        // 溢出，则返回一个溢出的id
        if (col < 0 || col > width || row < 0 || row > height) {
            return -1
        }
        return row * width + col
    }

    /**
     * 将像素id转换为像素坐标
     * @param id 
     * @param width 
     * @param height 
     */
    trans_pixel_id_to_p(id: number, width: number = this.node.width, height: number = this.node.height): cc.Vec2 {
        let row = Math.floor(id / height)
        let col = id % height
        return cc.v2(-width / 2 + col, height / 2 - row)
    }

    /**
     * 设置区域擦除完毕后的执行方法；传入rect来描述区域
     * @param rect 区域描述
     * @param f 执行方法
     * @param ratio 判断擦除完毕的比例
     * @param count 执行次数
     * @param interval 多次执行时的执行间隔；默认为0.5
     */
    set_finish_f_by_rect(
        rect: cc.Rect,
        f: Function,
        ratio: number = C.RATIO,
        count: number = 1,
        interval: number = 1.5
    ) {
        this.array_finish_f.push(new FInfo(rect, f, ratio, count, interval))
    }

    /**
     * 设置区域擦除完毕后的执行方法；传入center、width、height来描述区域
     * @param p_center
     * @param width 
     * @param height 
     * @param f 
     * @param ratio 
     * @param count 
     * @param interval 
     */
    set_finish_f_by_center(
        p_center: cc.Vec2,
        width: number,
        height: number,
        f: Function,
        ratio: number = C.RATIO,
        count: number = 1,
        interval: number = 1.5
    ) {
        this.set_finish_f_by_rect(
            cc.rect(p_center.x - width / 2, p_center.y - height / 2, width, height),
            f,
            ratio,
            count,
            interval
        )
    }

    /** 执行完成回调 */
    do_finish_f() {
        for (let finfo of this.array_finish_f) { finfo.do(this) }
    }

    /**
     * 隐藏mask；渐隐效果
     * @param time 渐隐时间
     */
    hide_mask(time: number) {
        this.mask.node.runAction(cc.fadeOut(time))
    }
}

/**
 * 完成回调信息类
 */
class FInfo {

    /**
     * 构造函数
     * @param rect 
     * @param f 
     * @param ratio 
     * @param count 
     * @param interval 
     */
    constructor(rect: cc.Rect, f: Function, ratio: number, count: number, interval: number) {
        this.rect = rect
        this.f = f
        this.ratio = ratio
        this.count = count
        this.interval = interval
        this.is_over = false
        this.is_cd = false
        this.finish_count = 0
        this.all_count = rect.width * rect.height
        this.id_set = new Set()
    }

    /** 区域描述 */
    rect: cc.Rect
    /** 执行函数 */
    f: Function
    /** 完成比例 */
    ratio: number
    /** 执行次数 */
    count: number
    /** 执行间隔 */
    interval: number
    /** 是否执行完毕 */
    is_over: boolean
    /** 是否执行cd */
    is_cd: boolean
    /** 点修改计数 */
    finish_count: number
    /** 点总计数 */
    all_count: number
    /** 保存当前区域内点对应的id；通过Set实现 */
    id_set: Set<number>

    /**
     * 执行回调；包括回调判定
     * @param t_erase 传入TErase组件
     */
    do(t_erase: TErase) {
        // 不满足执行条件
        if (this.is_over) { return }
        if (this.is_cd) { return }
        if (this.finish_count / this.all_count < this.ratio) { return }
        // 满足执行条件
        this.f()
        this.is_cd = true
        this.count -= 1
        if (this.count <= 0) {
            this.is_over = true
            return
        } else {
            t_erase.scheduleOnce(() => {
                this.id_set.forEach(id => t_erase.array_pixel_simplify[id] = C.PIXEL_STATE.FULL)
                this.finish_count = 0
                this.is_cd = false
            }, this.interval)
        }
    }

    /**
     * 保存区域内点的变化
     * - 判断点是否在区域内
     * - 保存点的id
     * - finish_count+=1
     * @param p 
     * @param id 
     */
    save_change(p, id) {
        if (this.rect.contains(p)) {
            this.id_set.add(id)
            this.finish_count += 1
        }
    }
}