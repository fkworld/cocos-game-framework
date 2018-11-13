import G from "../G";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, requireComponent } = cc._decorator;
const C = {
    DEFAULT_R: 50,
    DEFAULT_RATIO: 0.95,
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
 * - 单点圆，多点直线
 * - [注意] 图片的像素数组从左上角开始
 * - [注意] 节点的width和height需要为整数；并且最好为奇数
 */
@ccclass
@requireComponent(cc.Mask)
export default class TErase extends cc.Component {

    /**
     * 获取节点的对应组件
     * @param node 
     * @static
     */
    static get_component(node: cc.Node): TErase {
        return node.getComponent(TErase)
    }

    /** cc.Mask组件 */
    mask: cc.Mask

    /** 擦除半径 */
    r: number = C.DEFAULT_R

    /** 源像素数组；从左上角开始；每个像素用4个数值描述 */
    array_pixel_source: Uint8Array

    /** 简化像素数组；同源像素数组，但是不包含像素的RGB信息，每个像素用1个数值描述 */
    array_pixel_simplify: number[] = []

    onLoad() {
        this.init_mask()
        this.init_array_pixel()
        this.set_touch_event()
    }

    start() {
        this.draw_mask()
    }

    /**
     * 设置擦除半径
     * @param r 
     */
    set_r(r) { this.r = r }

    /** 完成后回调 */
    array_function_finish = []

    /**
     * 设置擦除完成回调
     * @param rect 
     * @param callback 
     * @param ratio 
     */
    set_finish_callback(rect, callback, ratio: number = C.DEFAULT_RATIO) {
        this.array_function_finish.push({
            /** 区域描述 */
            rect: rect,
            /** 完成比例 */
            ratio: ratio,
            /** 完成回调 */
            callback: callback,
            /** 完成回调是否执行 */
            over: false,
        })
    }

    /** 保存touch点，start */
    p_start: cc.Vec2

    /** 保存touch点，end */
    p_end: cc.Vec2

    /**
     * 设置点击时间
     */
    set_touch_event() {
        this.node.on(cc.Node.EventType.TOUCH_START, (e: cc.Touch) => {
            // 保存起点
            this.p_start = this.node.convertToNodeSpaceAR(e.getLocation())
            // 起点触摸draw circle
            this.draw_circle(this.p_start)
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Touch) => {
            // 保存临时点
            this.p_end = this.node.convertToNodeSpaceAR(e.getLocation())
            // draw line
            this.draw_circle_line(this.p_start, this.p_end)
            // 修改存储
            this.p_start = this.p_end
        })
        this.node.on(cc.Node.EventType.TOUCH_END || cc.Node.EventType.TOUCH_CANCEL, (e: cc.Touch) => {

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
     * 绘制单个像素
     * - 使用到实例化的this.array_pixel_simplify this.array_pixel_source
     * - 处理id溢出情况：不进行溢出id绘制
     * - 返回true表示有修改，false表示无修改
     * @param pixel_id 
     */
    draw_single_pixel(pixel_id: number): boolean {
        // id溢出处理
        if (pixel_id < 0 || pixel_id >= this.array_pixel_simplify.length) { return false }
        // 0改动处理
        if (this.array_pixel_simplify[pixel_id] === C.PIXEL_STATE.EMPTY) { return false }
        // 更改存储数值
        this.array_pixel_simplify[pixel_id] = C.PIXEL_STATE.EMPTY
        this.array_pixel_source[pixel_id * 4 + 3] = C.PIXEL_STATE.EMPTY
        return true
    }

    /**
     * 绘制多个点
     * @param array_p 要绘制的点
     */
    draw_array_point(array_p: cc.Vec2[]) {
        // 更改存储
        let change_flag = false
        for (let p of array_p) {
            let flag = this.draw_single_pixel(this.trans_p_to_pixel_id(p))
            change_flag = change_flag || flag
        }
        // 如果无更改，则直接return
        if (!change_flag) { return }
        this.draw_mask()
        this.do_finish_callback()
    }

    /**
     * 根据点p更改一个圆形内所有的像素点
     * @param p 
     * @param r 
     */
    draw_circle(p: cc.Vec2, r = this.r) {
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

    draw_circle_line(p0: cc.Vec2, p1: cc.Vec2, r = this.r) {
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
     * 获取area的擦除进
     * - [0,1]
     * @param rect area的描述，采用一个cc.Rect进行描述
     */
    get_area_ratio(rect: cc.Rect): number {
        let erase_count = 0
        let all_count = 0
        for (let x = rect.xMin; x < rect.xMax; x++) {
            for (let y = rect.yMin; y < rect.yMax; y++) {
                all_count += 1
                if (this.array_pixel_simplify[this.trans_p_to_pixel_id(cc.v2(x, y))] === C.PIXEL_STATE.EMPTY) {
                    erase_count += 1
                }
            }
        }
        return erase_count / all_count
    }

    /**
     * area是否已经擦除完毕
     * @param rect 
     * @param ratio 
     */
    is_area_finish(rect: cc.Rect, ratio: number = C.DEFAULT_RATIO) {
        return this.get_area_ratio(rect) >= ratio
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

    /** 执行完成回调 */
    do_finish_callback() {
        for (let info of this.array_function_finish) {
            if (info['over']) { continue }
            if (!this.is_area_finish(info['rect'], info['ratio'])) { return }
            info['over'] = true
            info['callback']()
        }
    }

    /**
     * 隐藏mask；渐隐效果
     * @param time 渐隐时间
     */
    hide_mask(time: number) {
        this.mask.node.runAction(cc.fadeOut(time))
    }

    /**
     * 自动擦除
     * - 擦除一条线
     * - 间隔帧绘制
     * @param p0 线的起点
     * @param p1 线的终点
     * @param t 时间
     * @param r 线宽
     * @param interval 刷新间隔（默认为1/20s）
     */
    auto_erase_line(p0: cc.Vec2, p1: cc.Vec2, time: number, r: number = this.r, interval: number = 0.05) {
        let fuzzy_interval = time / Math.floor(time / interval)
        let old_p = p0
        let new_p = null
        let i = 0
        this.schedule(() => {
            new_p = p0.lerp(p1, i / Math.floor(time / interval))
            this.draw_circle_line(old_p, new_p, r)
            old_p = new_p
            i += 1
        }, fuzzy_interval, Math.floor(time / interval))
    }
}
