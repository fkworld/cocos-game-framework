/**
 * 框架文件：全局类
 * - 封装一些重要的方法
 */
class Global {
    /**
     * 获取一个随机整数
     * - 范围 [min,max)
     * @param {number} min 左边界
     * @param {number} max 右边界
     * @returns {number} rn 随机数
     */
    random_int(min, max) {
        let rn = Math.floor(Math.random() * (max - min) + min)
        return rn
    }

    /**
     * 获取一个随机小数
     * - 范围 [min,max)
     * @param {number} min 
     * @param {number} max 
     * @returns {number} rn
     */
    random_float(min, max) {
        let rn = Math.random() * (max - min) + min
        return rn
    }

    /**
     * 将此节点设置为btn_like节点
     * - 包含：放大缩小效果，按钮点击音效
     * - 特别注意：由于引擎load顺序的关系，尽量将audio的节点放在前面，UI节点放在后面，否则会有一些莫名其妙的bug
     * @param {cc.Node} node 传入节点
     */
    set_as_btn_like(node) {
        // 添加一个button组件
        if (node.getComponent(cc.Button) === null) {
            let btn = node.addComponent(cc.Button)
            btn.transition = cc.Button.Transition.SCALE
            btn.duration = 0.05
            btn.zoomScale = 0.9
        }
        // 添加点击音效
        // node.on(cc.Node.EventType.TOUCH_END, () => {

        // }, node)
    }

}

/** 
 * Global全局类实例
 */
export let G = new Global()
