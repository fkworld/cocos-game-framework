declare namespace cc {

    /** cc.tween方法 */
    function tween(target: cc.Node): NewTween;

    /** ease字符串,参考:https://docs.cocos.com/creator/api/zh/editor/share/easing.html */
    type tweenEasing = "linear" | "fade" |
        "quadIn" | "quadOut" | "quadInOut" | "quadOutIn" |
        "cubicIn" | "cubicOut" | "cubicInOut" | "cubicOutIn" |
        "quartIn" | "quartOut" | "quartInOut" | "quartOutIn" |
        "quintIn" | "quintOut" | "quintInOut" | "quintOutIn" |
        "sineIn" | "sineOut" | "sineInOut" | "sineOutIn" |
        "expoIn" | "expoOut" | "expoInOut" | "expoOutIn" |
        "circIn" | "circOut" | "circInOut" | "circOutIn" |
        "elasticIn" | "elasticOut" | "elasticInOut" | "elasticOutIn" |
        "backIn" | "backOut" | "backInOut" | "backOutIn" |
        "bounceIn" | "bounceOut" | "bounceInOut" | "bounceOutIn";

    /** 可选属性,参考:cc.Node */
    type tweenProps = Partial<cc.Node>;

    /** 可选参数 */
    type tweenOpts = {
        progress?: Function;
        easing?: Function | tweenEasing;
    }

    /** cc.Tween,为了区分开来使用cc.NewTween */
    class NewTween {
        then(other: Action | NewTween): NewTween;
        target(target: any): NewTween;
        start(): NewTween;
        stop(): NewTween;
        clone(target?: any): NewTween;
        to(duration: number, props?: tweenProps, opts?: tweenOpts): NewTween;
        by(duration: number, props?: tweenProps, opts?: tweenOpts): NewTween;
        set(props: tweenProps): NewTween;
        delay(duration: number): NewTween;
        call(callback: Function): NewTween;
        hide(): NewTween;
        show(): NewTween;
        removeSelf(): NewTween;
        sequence(actions: [Action | NewTween]): NewTween;
        parallel(actions: [Action | NewTween]): NewTween;
        repeat(repeatTimes: number, action?: Action | NewTween): NewTween;
        repeatForever(action?: Action | NewTween): NewTween;
        reverseTime(action?: Action | NewTween): NewTween;
        tween(target?: any): NewTween;
    }
}