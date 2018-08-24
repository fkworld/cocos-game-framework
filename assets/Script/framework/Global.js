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
     * 从数组中获取一个随机值（概率相等）
     * @param {[]} array 
     */
    random_item_form_array(array) {
        if (array.length === 0) { return }
        let rn = this.random_int(0, array.length)
        return array[rn]
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

    /**
     * 设置node节点的标准点击事件
     * @param {cc.Node} node 节点
     * @param {boolean} is_btn_like 是否有点击效果
     * @param {Function} f 点击处理函数
     */
    set_event(node, is_btn_like, f) {
        node.on(cc.Node.EventType.TOUCH_END, f)
        if (is_btn_like) {
            this.set_as_btn_like(node)
        }
    }

    /**
     * 依次运行多个promise
     * - 考虑到async/await各个平台的支持情况不同，尽量不要在代码中使用
     * - 默认每个promise，resolve一个无关的返回值；如果返回值是有用的，则无法使用这个方法
     * - 我也不知道为啥这样写就能成功。。。嗯。。。
     * - 实际使用起来感觉也挺复杂的（参考MRes.load_chain()），以后再改动吧。
     * @param {[()=>{}]} promise_array 由于promise建立后立即执行的特性（坑），因此需要使用一个箭头函数进行包装
     * @returns {Promise}
     */
    run_promise_chain(promise_array) {
        let p = Promise.resolve()
        for (let promise of promise_array) {
            p = p.then(promise)
        }
        return p
    }

    /**
     * 依次运行多个promise（有缺点）
     * - 使用递归算法
     * - 【注意】 异步操作无法使用尾递归优化
     * - 【注意】 异步操作无法返回一个正常的返回值（异步函数会直接返回undefined）,应该无法在此函数后使用then()
     * @param {[()=>{}]} promise_array
     * @returns {undefined}
     */
    run_promise_chain_with_recursive(promise_array) {
        if (promise_array.length === 0) { return }
        let a = promise_array.shift()
        a().then(() => {
            this.run_promise_chain_with_recursive(promise_array)
        })
    }
}

/** Global全局类实例 */
let G = new Global()
export default G
