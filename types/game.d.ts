declare namespace cc {
  /** cc.tween 方法 */
  export function tween<T>(target?: T): _FixTween<T>;

  /**
   * ease 字符串
   * - 参考:https://docs.cocos.com/creator/api/zh/editor/share/easing.html
   */
  type TweenEasing =
    | "linear"
    | "fade"
    | "quadIn"
    | "quadOut"
    | "quadInOut"
    | "quadOutIn"
    | "cubicIn"
    | "cubicOut"
    | "cubicInOut"
    | "cubicOutIn"
    | "quartIn"
    | "quartOut"
    | "quartInOut"
    | "quartOutIn"
    | "quintIn"
    | "quintOut"
    | "quintInOut"
    | "quintOutIn"
    | "sineIn"
    | "sineOut"
    | "sineInOut"
    | "sineOutIn"
    | "expoIn"
    | "expoOut"
    | "expoInOut"
    | "expoOutIn"
    | "circIn"
    | "circOut"
    | "circInOut"
    | "circOutIn"
    | "elasticIn"
    | "elasticOut"
    | "elasticInOut"
    | "elasticOutIn"
    | "backIn"
    | "backOut"
    | "backInOut"
    | "backOutIn"
    | "bounceIn"
    | "bounceOut"
    | "bounceInOut"
    | "bounceOutIn";

  /** 可选属性 */
  type _TweenProps<T> = Partial<T>;

  /** 可选参数
   * - 【注意】progress 函数中需要的类型一般为 number，未必一定是 number
   */
  type _TweenOpts = {
    easing?: TweenEasing | ((t: number) => number);
    progress?: (start: number, end: number, current: number, ratio: number) => number;
  };

  /**
   * 修复之后的 Tween 类，附带完整的类型提示
   * - 【注意】不包括 cc.Action，不要在使用 tween 时使用 action。
   */
  class _FixTween<T> {
    then(other: _FixTween<T>): this;
    target(target: T): this;
    start(): this;
    stop(): this;
    tag(tag: number): this;
    clone(target?: T): this;
    union(): this;
    bezierTo(duration: number, c1: Vec2, c2: Vec2, to: Vec2): this;
    bezierBy(duration: number, c1: Vec2, c2: Vec2, to: Vec2): this;
    flipX(): this;
    flipY(): this;
    blink(duration: number, times: number, opts?: _TweenOpts): this;
    to(duration: number, props?: _TweenProps<T>, opts?: _TweenOpts): this;
    by(duration: number, props?: _TweenProps<T>, opts?: _TweenOpts): this;
    set(props: _TweenProps<T>): this;
    delay(duration: number): this;
    call(callback: Function): this;
    hide(): this;
    show(): this;
    removeSelf(): this;
    sequence(...actions: _FixTween<T>[]): this;
    parallel(...actions: _FixTween<T>[]): this;
    repeat(repeatTimes: number, action?: _FixTween<T>): this;
    repeatForever(action?: _FixTween<T>): this;
    reverseTime(action?: _FixTween<T>): this;
  }
}

declare namespace Editor {
  const assettype2name: object;

  /**
   * - 参考1:https://docs.cocos.com/creator/api/zh/editor/asset-db.html
   * - 参考2:https://docs.cocos.com/creator/manual/zh/extension/api/asset-db/asset-db-renderer.html
   * - [注意] 两份参考文档有冲突,文档中也有一部分是错误的(应该去怪官方)
   * - [注意] 仅可以在编辑器中使用
   * - [注意] 注意.png不是spriteFrame,需要 xxx.png/xxx 的形式
   * - [使用建议] 根据url获取uuid,再使用cc.loader.load({uuid:-},-)来获取到具体的类型
   */
  declare namespace assetdb {
    /** 资源的url字符串
     * - 标准格式为 db://assets/other/TLoadVillageSlot.ts
     * - 也可以写成pattern格式: db://assets/other/*
     * - [pattern格式] ?-匹配任何单字符;*-匹配0或者任意数量的字符;**-匹配0或者更多的目录
     */
    type TypeAssetUrl = string;
    /** 资源的uuid(唯一),格式为 9d4df177-0363-49aa-8f97-52ddae37e2fb */
    type TypeAssetUuid = string;
    /** 资源在系统中的绝对路径,格式为: /Users/fengyong/Documents/workspace/coinmas/coinmas/assets/other/TLoadVillageSlot.ts */
    type TypeAssetFspath = string;

    /** asset-type;参考Editor.assettype2name */
    type AssetType =
      | "native-asset"
      | "animation-clip"
      | "audio-clip"
      | "bitmap-font"
      | "coffeescript"
      | "typescript"
      | "javascript"
      | "json"
      | "particle"
      | "prefab"
      | "scene"
      | "texture-packer"
      | "sprite-frame"
      | "texture"
      | "ttf-font"
      | "text"
      | "label-atlas"
      | "buffer"
      | "raw-asset"
      | "script"
      | "font"
      | "spine"
      | "tiled-map"
      | "dragonbones"
      | "dragonbones-atlas";

    /** asset-info;不同方法下的返回值不同,这里是一个包含全部的 */
    type TypeAssetInfo = {
      type: AssetType;
      url: TypeAssetUrl;
      uuid: TypeAssetUuid;
      path: TypeAssetFspath;
      isSubAsset: boolean;
      extname: string; // 资源文件后缀名
      destPath: TypeAssetFspath; // 资源编译后(?不确定)的目标路径
      parentUuid: TypeAssetUuid;
      hidden: boolean;
      readonly: boolean;
    };

    /** asset-meta-info,可能类型不完整,文档中没有 */
    type TypeAssetMetaInfo = {
      ver: string;
      uuid: TypeAssetUuid;
      isPlugin: boolean;
      loadPluginInWeb: boolean;
      loadPluginInNative: boolean;
      loadPluginInEditor: boolean;
      __subMetas__: { [k: string]: TypeAssetMetaInfo };
    };

    /** 当前项目所在的绝对路径 */
    const library: string;

    declare namespace remote {
      function urlToUuid(url: TypeAssetUrl): TypeAssetUuid;
      function urlToFspath(url: TypeAssetUrl): TypeAssetFspath;

      function uuidToFspath(uuid: TypeAssetUuid): TypeAssetFspath;
      function uuidToUrl(uuid: TypeAssetUuid): TypeAssetUrl;

      function fspathToUuid(fspath: TypeAssetFspath): TypeAssetUuid;
      function fspathToUrl(fspath: TypeAssetFspath): TypeAssetUrl;

      /** 获取asset-info */
      function assetInfo(url: TypeAssetUrl): Partial<TypeAssetInfo>;
      function assetInfoByUuid(uuid: TypeAssetUuid): Partial<TypeAssetInfo>;
      function assetInfoByPath(fspath: TypeAssetFspath): Partial<TypeAssetInfo>;

      /** 判断资源是否存在,注意实际测试返回类型是boolean,与文档中不同 */
      function exists(url: TypeAssetUrl): boolean;
      function existsByUuid(uuid: TypeAssetUuid): boolean;
      function existsByPath(fspath: TypeAssetFspath): boolean;

      /** 判断是否为sub-asset */
      function isSubAsset(url: TypeAssetUrl): boolean;
      function isSubAssetByUuid(uuid: TypeAssetUuid): boolean;
      function isSubAssetByPath(fspath: TypeAssetFspath): boolean;

      /** 判断是否包含sub-asset */
      function containsSubAssets(url: TypeAssetUrl): boolean;
      function containsSubAssetsByUuid(uuid: TypeAssetUuid): boolean;
      function containsSubAssetsByPath(fspath: TypeAssetFspath): boolean;

      /** 获取sub-asset-info的数组;如果没有sub-asset,则返回一个[] */
      function subAssetInfos(url: TypeAssetUrl): Partial<TypeAssetInfo>[];
      function subAssetInfosByUuid(uuid: TypeAssetUuid): Partial<TypeAssetInfo>[];
      function subAssetInfosByPath(fspath: TypeAssetFspath): Partial<TypeAssetInfo>[];

      /** 获取asset文件对应的meta内容 */
      function loadMeta(url: TypeAssetUrl): TypeAssetMetaInfo;
      function loadMetaByUuid(uuid: TypeAssetUuid): TypeAssetMetaInfo;
      function loadMetaByPath(fspath: TypeAssetFspath): TypeAssetMetaInfo;

      /** 不要使用;mount相关,不知道是干啥的,猜测与目录挂载相关? */
      function isMount(url: TypeAssetUrl): boolean;
      function isMountByUuid(uuid: TypeAssetUuid): boolean;
      function isMountByPath(fspath: TypeAssetFspath): boolean;
      function mountInfo(url: TypeAssetUrl);
      function mountInfoByUuid(uuid: TypeAssetUuid);
      function mountInfoByPath(fspath: TypeAssetFspath);
      function mount(
        path: TypeAssetFspath,
        mountPath: string,
        opts: { hide: any; virtual: any; icon: any },
        cb: Function,
      );
      function unmount(path: TypeAssetFspath, cb: Function);
      function attachMountPath(path: TypeAssetFspath, cb: Function);
      function unattachMountPath(path: TypeAssetFspath, cb: Function);
    }

    /** 不要使用;一些操作相关的方法
     * - [注意] ts中不允许定义名称为保留字的function,实际调用时需要去掉_allow
     */
    function explore(url: TypeAssetUrl);
    function exploreLib(url: TypeAssetUrl);
    function import_allow(
      rawfiles: TypeFsPath[],
      destUrl: TypeAssetUrl,
      showProgress: boolean,
      cb: Function,
    );
    function create(url: TypeAssetUrl, data: string, cb: Function);
    function move(srcUrl: string, destUrl: string, showMessageBox);
    function delete_allow(urls: TypeAssetUrl[]);
    function saveExists(url: TypeAssetUrl, data: string, cb: Function);
    function createOrSave(url: TypeAssetUrl, data: string, cb: Function);
    function saveMeta(uuid: TypeAssetUuid, metaJson: string, cb: Function);
    function refresh(url: TypeAssetUrl, cb: Function);

    /** 以下方法可以在remote中找到对应方法,不同点是这里的方法是异步的,因此推荐使用remote */
    function queryPathByUrl(url: TypeAssetUrl, cb: Function);
    function queryUuidByUrl(url: TypeAssetUrl, cb: Function);
    function queryPathByUuid(uuid: TypeAssetUuid, cb: Function);
    function queryInfoByUuid(uuid: TypeAssetUuid, cb: Function);
    function queryMetaInfoByUuid(uuid: TypeAssetUuid, cb: Function);

    /** 不要使用;深度遍历(完整遍历) */
    function deepQuery(cb: (err: Error, results: Partial<TypeAssetInfo>[]) => void);

    /** 遍历路径下特定类型的资源 */
    function queryAssets(
      pattern: TypeAssetUrl,
      type: AssetType | AssetType[],
      cb: (err: Error, results: Partial<TypeAssetInfo>[]) => void,
    );
  }
}
