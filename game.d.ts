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

declare namespace Editor {

    const assettype2name: object;

    /** asset-type;参考Editor.assettype2name */
    type AssetType = "native-asset" | "animation-clip" | "audio-clip" | "bitmap-font" |
        "coffeescript" | "typescript" | "javascript" | "json" |
        "particle" | "prefab" | "scene" | "texture-packer" |
        "sprite-frame" | "texture" | "ttf-font" | "text" |
        "label-atlas" | "buffer" | "raw-asset" | "script" |
        "font" | "spine" | "tiled-map" | "dragonbones" |
        "dragonbones-atlas";

    /** asset-info;不同方法下的返回值不同,这里是一个包含全部的 */
    type AssetInfo = {
        type: AssetType,
        path: string,
        url: string,
        uuid: string,
        parentUuid: string,
        hidden: boolean,
        isSubAsset: boolean,
        readonly: boolean,
        name: string,
        extname: string,
        destPath: string,
    }

    /** asset-meta-info; */
    type AssetMetaInfo = {
        assetMtime: string,
        assetPath: string,
        assetType: AssetType,
        assetUrl: string,
        defaultType: AssetType
        isSubMeta: boolean,
        json: string,
        metaMtime: string,
        metaPath: string,
    }

    /**
     * 实例
     * - [注意] 仅可以在编辑器中使用
     * - [注意] url需要以 db://assets/ 开头
     * - [注意] 注意.png不是spriteFrame,需要 xxx.png/xxx 的形式
     * - [使用建议] 根据url获取uuid,再使用cc.loader.load({uuid:-},-)来获取到具体的类型
     */
    const assetdb: AssetDB;
    class AssetDB {
        /** 重定向,可以不使用 */
        remote: any;
        /** The library path;绝对路径 */
        library: string;
        /**
         * Reveal given url in native file system
         * 在系统中打开某个路径
         * @param url 以"db://"开头
         */
        explore(url: string): void;
        /**
         * Reveal given url's library file in native file system
         * 在系统中打开lib下的某个路径
         * @param url
         */
        exploreLib(url: string): void;
        /**
         * Get native file path by url
         * @param url
         * @param cb
         * @example Editor.assetdb.queryPathByUrl("")
         */
        queryPathByUrl(url: string, cb: (err: Error, result: string) => void);
        /**
         * Get uuid by url
         * @param url
         * @param cb
         * @example Editor.assetdb.queryUuidByUrl("db://assets/texture/singleColor.png/singleColor", (err, result) => {})
         */
        queryUuidByUrl(url: string, cb: (err: Error, result: string) => void);
        /**
         * Get native file path by uuid
         * @param uuid
         * @param cb
         * @example Editor.assetdb.queryUuidByUrl("03b56ad9-1449-4f0a-a769-5c547cabff20", (err, result) => {})
         */
        queryPathByUuid(uuid: string, cb: (err: Error, result: string) => void);
        /**
         * Get asset url by uuid
         * @param uuid
         * @param cb
         * @example Editor.assetdb.queryUrlByUuid("03b56ad9-1449-4f0a-a769-5c547cabff20", (err, result) => {})
         */
        queryUrlByUuid(uuid: string, cb: (err: Error, result: string) => void);
        /**
         * Get asset info by uuid
         * @param uuid
         * @param cb
         * @example Editor.assetdb.queryInfoByUuid("03b56ad9-1449-4f0a-a769-5c547cabff20", (err, result) => {})
         */
        queryInfoByUuid(uuid: string, cb: (err: Error, result: Partial<AssetInfo>) => void);
        /**
         * Get meta info by uuid
         * @param uuid
         * @param cb
         */
        queryMetaInfoByUuid(uuid: string, cb: (err: Error, result: Partial<AssetMetaInfo>) => void);
        /**
         * Query all assets from asset-db
         * @param cb
         */
        deepQuery(cb: (err: Error, results: Partial<AssetInfo>[]) => void);
        /**
         * Query assets by url pattern and asset-type
         * @param pattern 参考url-patterns(我也不知道具体应该称之为什么);?-匹配任何单字符;*-匹配0或者任意数量的字符;**-匹配0或者更多的目录
         * @param type
         * @param cb
         * @param url
         * @param assetType
         */
        queryAssets(pattern: string, type: AssetType | AssetType[], cb: (err: Error, results: Partial<AssetInfo>[]) => void);
        import
        create
        move
        delete
        saveExists
        createOrSave
        saveMeta
        refresh
    }
}
