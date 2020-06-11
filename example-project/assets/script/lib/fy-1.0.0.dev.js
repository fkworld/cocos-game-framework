/*! fy-1.0.0 https://github.com/fkworld/cocos-game-framework */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.fy = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * 事件模块
     * - 使用cc.EventTarget实现
     */
    /** 事件中心 */
    var event_center = new cc.EventTarget();

    /**
     * 状态表
     * - key 为状态名称
     * - value 状态内容
     */
    var StateTable = /** @class */ (function () {
        function StateTable(source) {
            this.source = new Map(Object.entries(source));
        }
        /**
         * 判断是否包含某个状态
         * @param key
         */
        StateTable.prototype.has = function (key) {
            return this.source.has(key);
        };
        /**
         * 获取某个状态的值
         * @param key
         */
        StateTable.prototype.get = function (key) {
            return this.source.get(key);
        };
        /** 获取全部状态 */
        StateTable.prototype.get_all = function () {
            return this.source;
        };
        /**
         * 新增某个状态
         * @param key
         * @param value
         */
        StateTable.prototype.add = function (key, value) {
            this.source.set(key, value);
        };
        /**
         * 删除某个状态
         * @param key
         * @param value
         */
        StateTable.prototype.del = function (key, value) {
            this.source.delete(key);
        };
        /** 获取所有的key */
        StateTable.prototype.get_keys = function () {
            return __spread(this.source.keys());
        };
        return StateTable;
    }());

    /**
     * 版本管理模块
     * - 通过版本标记管理游戏版本。
     * - 使用正向含义标记。
     * - 需要在运行时初始化，传入2个配置数据：ConfigVersion，ConfigVersionInfo。
     */
    /**
     * 初始化版本信息
     * @param config 版本标记信息
     * @param info 版本额外信息
     */
    function _init_version(config, info) {
        if (config === void 0) { config = { resetLocal: 1 }; }
        exports.version_center = new StateTable(config);
        exports.version_center.get_all().forEach(function (v, k) {
            !v && exports.version_center.del(k);
        });
    }
    /** dev模式下全局变量，针对类的装饰器 */
    function DeDevConsole(constructor) {
        CC_DEV && (window[constructor.name] = constructor);
    }
    /** dev模式下全局变量，针对模块 */
    function DeDevConsoleNamespace(name, namespace) {
        CC_DEV && (window[name] = namespace);
    }

    /**
     * 本地存储模块
     * - 需要在运行时初始化
     */
    /** 缓存 */
    var locals;
    /** 默认值 */
    var locals_default;
    /**
     * 在运行时初始化
     * @param config
     */
    function _init_local(config) {
        if (config === void 0) { config = { language: "chinese", music: true, sound: true }; }
        locals = new Map();
        locals_default = config;
        exports.version_center.has("resetLocal") && cc.sys.localStorage.clear();
    }
    /**
     * 获取本地存储值
     * - 无值，则返回undefined
     * - 顺序依次为：缓存，本地存储，配置的默认值
     * @param key
     */
    function get_local(key) {
        var _a, _b;
        var value = (_b = (_a = locals.get(key)) !== null && _a !== void 0 ? _a : cc.sys.localStorage.getItem(key)) !== null && _b !== void 0 ? _b : "" + locals_default[key];
        locals.set(key, value);
        return value;
    }
    /**
     * 修改本地存储
     * @param key
     * @param value
     */
    function set_local(key, value) {
        locals.set(key, value);
        Promise.resolve().then(function () { return cc.sys.localStorage.setItem(key, value); });
    }

    /**
     * 日志模块
     */
    (function (LogLevel) {
        /** 开发者。 */
        LogLevel[LogLevel["DEV"] = 0] = "DEV";
        /** 正常。 */
        LogLevel[LogLevel["NORMAL"] = 1] = "NORMAL";
        /** 警告信息。发生了一些错误，一般不会导致游戏崩溃。 */
        LogLevel[LogLevel["WARN"] = 2] = "WARN";
        /** 错误信息。发生了一些错误，可能会导致游戏崩溃。 */
        LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
        /** 重大错误信息。一般需要重启游戏。 */
        LogLevel[LogLevel["IMPORTANT_ERROR"] = 4] = "IMPORTANT_ERROR";
    })(exports.LogLevel || (exports.LogLevel = {}));
    var _init_log = function (level) {
        exports.log_level = level;
    };
    /**
     * 输出log
     * - 根据给定的log_level输出log信息。
     * - console还有很多高级用法，这里不做封装，可以直接使用。参考：https://juejin.im/post/5b586ec06fb9a04fc436c9b3#heading-13
     * @param level
     * @param params
     */
    function log(level) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (level < exports.log_level) {
            return;
        }
        switch (level) {
            case exports.LogLevel.DEV:
            case exports.LogLevel.NORMAL:
                return cc.log.apply(cc, __spread(["[" + level + "]:"], params));
            case exports.LogLevel.WARN:
                return cc.warn.apply(cc, __spread(["[" + level + "]:"], params));
            case exports.LogLevel.ERROR:
            case exports.LogLevel.IMPORTANT_ERROR:
                return cc.error.apply(cc, __spread(["[" + level + "]:"], params));
        }
    }

    /**
     * 工具函数模块
     * - 与cocos creator相关的函数
     */
    var _a;
    /**
     * 适配canvas
     * - 【注意】cc.winSize只有在适配后才能获取到正确的值，因此需要使用cc.getFrameSize来获取初始的屏幕大小
     * @param canvas
     */
    function adjust_canvas(canvas) {
        var screen_size = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
        var design_size = canvas.designResolution.width / canvas.designResolution.height;
        var f = screen_size >= design_size;
        canvas.fitHeight = f;
        canvas.fitWidth = !f;
    }
    /**
     * 刷新给定节点的widget
     * @param node
     */
    function do_widget(node) {
        var w = node.getComponent(cc.Widget);
        if (w && w.enabled) {
            w.updateAlignment();
            if (w.alignMode === cc.Widget.AlignMode.ONCE ||
                w.alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                w.enabled = false;
            }
        }
    }
    /**
     * 刷新给定节点下所有的widget
     * @param node
     */
    function do_widget_all(node) {
        node.getComponentsInChildren(cc.Widget).forEach(function (w) { return do_widget(w.node); });
    }
    /**
     * schedule/scheduleOnce的封装
     * - 使用cc.Tween实现
     * - 使用cc.Tween.stopAllByTarget方法来取消
     * @param target
     * @param interval 执行间隔，单位为s。
     * @param count 重复次数，包括首次。如果为0，则表示一直重复，此时会直接抛出res。
     * @param is_first 是否在启动时执行首次
     * @param f
     */
    function do_schedule(target, interval, count, is_first, f) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        var index = 0;
                        var do_f = function () {
                            f(index);
                            index += 1;
                        };
                        if (is_first) {
                            do_f();
                            count -= 1;
                        }
                        if (count <= 0) {
                            res();
                            cc.tween(target).delay(interval).call(do_f).union().repeatForever().start();
                        }
                        else {
                            cc.tween(target).delay(interval).call(do_f).union().repeat(count).call(res).start();
                        }
                    })];
            });
        });
    }
    /**
     * 获取节点的世界坐标
     * @param node
     */
    function get_node_wp(node) {
        return node.convertToWorldSpaceAR(cc.Vec3.ZERO);
    }
    /**
     * 根据世界坐标设置节点本地坐标
     * @param node
     * @param wp
     * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
     */
    function set_node_by_wp(node, wp, flag) {
        if (flag === void 0) { flag = false; }
        var lp = node.parent.convertToNodeSpaceAR(wp);
        flag && (node.position = lp);
        return lp;
    }
    /**
     * 载入单个资源
     * - 一般用于已知uuid的载入
     * @description cc.loader.load
     * @param resources
     */
    function load(resources) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        cc.loader.load(resources, function (err, r) {
                            err && log(exports.LogLevel.ERROR, "\u8F7D\u5165\u8D44\u6E90\u5931\u8D25\uFF0Cresources=" + resources + "\uFF0Cerr=" + err);
                            err ? res() : res(r);
                        });
                    }).catch(function (err) {
                        log(exports.LogLevel.ERROR, "\u8F7D\u5165\u8D44\u6E90\u5931\u8D25\uFF0Cresources=" + resources + "\uFF0Cerr=" + err);
                    })];
            });
        });
    }
    /**
     * 载入resources下的单个资源
     * - 统一在运行时载入和在编辑器中载入
     * - 如果无此资源，则报错并返回undefined
     * @param path 资源路径，以运行时路径为准
     * @param type
     */
    function load_res(path, type) {
        return __awaiter(this, void 0, void 0, function () {
            var url, uuid;
            return __generator(this, function (_a) {
                if (CC_EDITOR) {
                    url = to_editor_url(path);
                    // 针jpg和png资源完善路径
                    if (new cc.SpriteFrame() instanceof type) {
                        // cc.path.join的声明有错误，需要使用as any修正
                        url = cc.path.join(url, get_filename(url));
                    }
                    uuid = Editor.assetdb.remote.urlToUuid(url);
                    return [2 /*return*/, load({ type: "uuid", uuid: uuid })];
                }
                else {
                    return [2 /*return*/, new Promise(function (res) {
                            // 运行时载入
                            path = cc.path.mainFileName(path);
                            cc.loader.loadRes(path, type, function (err, r) {
                                err && log(exports.LogLevel.ERROR, "\u8F7D\u5165\u8D44\u6E90\u5931\u8D25, path=" + path + ", err=" + err);
                                err ? res() : res(r);
                            });
                        })];
                }
            });
        });
    }
    /**
     * 载入resources下某个文件夹下的所有资源
     * - 不同平台下的载入顺序不同，因此在载入完毕后需要进行排序
     * @param path
     * @param type
     */
    function load_res_dir(path, type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        cc.loader.loadResDir(path, type, function (err, r) {
                            err && log(exports.LogLevel.ERROR, "\u8F7D\u5165\u8D44\u6E90\u7EC4\u5931\u8D25, path=" + path + ", err=" + err);
                            err ? res() : res(r);
                        });
                    })];
            });
        });
    }
    // cc.Intersection
    var lineLine = (_a = cc.Intersection, _a.lineLine), lineRect = _a.lineRect, linePolygon = _a.linePolygon, rectRect = _a.rectRect, rectPolygon = _a.rectPolygon, polygonCircle = _a.polygonCircle, polygonPolygon = _a.polygonPolygon, circleCircle = _a.circleCircle, pointInPolygon = _a.pointInPolygon, pointLineDistance = _a.pointLineDistance;
    function pointInCircle(point, circle) {
        return point.sub(circle.position).len() <= circle.radius;
    }
    /**
     * 获取无后缀的文件名
     * @param path
     */
    function get_filename(path) {
        return cc.path.basename("/" + path, cc.path.extname(path));
    }
    /**
     * 将 resources 下的路径转为编辑器 url
     * @param resources_path
     */
    function to_editor_url(path) {
        return cc.path.join("db://assets/resources/", path);
    }
    /**
     * 获取子节点
     * - 使用cc.find获取子节点
     * @param n
     * @param childs 子节点类型
     * @param childs_path 子节点路径
     */
    function get_node_childs(n, childs, childs_path) {
        if (childs_path === void 0) { childs_path = {}; }
        var r = { self: n };
        Object.entries(childs).forEach(function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            var path = childs_path[k] || k;
            var child_node = cc.find(path, n);
            if (!child_node) {
                log(exports.LogLevel.ERROR, "获取子节点失败，path=", path);
                r[k] = child_node;
                return;
            }
            r[k] = v === cc.Node ? child_node : child_node.getComponent(v);
        });
        return r;
    }

    /**
     * 简单有限状态机：simple finite state machine
     * - 使用string类型作为state的标记
     * - 在执行事件过渡动作时，整个状态机处于锁定状态
     */
    var SimpleFSM = /** @class */ (function () {
        /**
         * 初始化状态机
         * @param states 状态描述，value值为其可跳转的状态
         * @param initial
         */
        function SimpleFSM(initial, states) {
            this.state = initial;
            this.states = states;
            this.is_lock = false;
        }
        /** 锁定状态机 */
        SimpleFSM.prototype.lock = function () {
            this.is_lock = true;
        };
        /** 解锁状态机 */
        SimpleFSM.prototype.unlock = function () {
            this.is_lock = false;
        };
        /** 是否处于某个状态中 */
        SimpleFSM.prototype.is_state = function () {
            var states = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                states[_i] = arguments[_i];
            }
            return states.includes(this.state);
        };
        /** is_state的lock版本 */
        SimpleFSM.prototype.is_state_with_lock = function () {
            var states = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                states[_i] = arguments[_i];
            }
            return this.is_state.apply(this, __spread(states)) && !this.is_lock;
        };
        /** 是否可以去到下个状态 */
        SimpleFSM.prototype.can_go_state = function (state) {
            return this.states[this.state].includes(state);
        };
        /** can_go_state的lock版本 */
        SimpleFSM.prototype.can_go_state_with_lock = function (state) {
            return this.can_go_state(state) && !this.is_lock;
        };
        /** 尝试去到下个状态 */
        SimpleFSM.prototype.try_go_state = function (state) {
            if (this.can_go_state(state)) {
                this.state = state;
                return true;
            }
            else {
                return false;
            }
        };
        /** try_go_state的lock 版本 */
        SimpleFSM.prototype.try_go_state_with_lock = function (state) {
            if (this.can_go_state_with_lock(state)) {
                this.state = state;
                return true;
            }
            else {
                return false;
            }
        };
        return SimpleFSM;
    }());

    /**
     * 声音模块
     * - 用于处理游戏内的声音逻辑
     */
    /** 事件：打开音乐开关 */
    var EVENT_MUSIC_SWITCH_OPEN = "audio/music-switch-open";
    /** 所有声音的实例信息 */
    var audios;
    /** 音乐开关 */
    var music_switch;
    /** 音效开关 */
    var sound_switch;
    /**
     * 初始化
     * - TODO：在初始化中设置声音实例为1，可能会有bug，需要进一步测试
     * @param config
     */
    function _init_audio(config) {
        if (config === void 0) { config = {}; }
        audios = new Map(Object.entries(config).map(function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            var ins = {
                fsm: new SimpleFSM("prepare", {
                    prepare: ["ok", "error"],
                    ok: [],
                    error: [],
                }),
                type: k.includes("###") ? "music" : "sound",
                url: v,
            };
            // TODO：设置单实例，可能会有bug，需要测试
            cc.audioEngine.setMaxAudioInstance(1);
            return [k, ins];
        }));
        music_switch = get_local("music") === "true";
        sound_switch = get_local("sound") === "true";
    }
    /** 获取音乐开关 */
    function get_music_switch() {
        return music_switch;
    }
    /** 反向音乐开关 */
    function reverse_music_switch() {
        music_switch = !music_switch;
        music_switch ? event_center.emit(EVENT_MUSIC_SWITCH_OPEN) : cc.audioEngine.stopAll();
        set_local("music", "" + music_switch);
    }
    /** 获取音效开关 */
    function get_sound_switch() {
        return sound_switch;
    }
    /** 反向音乐开关 */
    function reverse_sound_switch() {
        sound_switch = !sound_switch;
        set_local("sound", "" + sound_switch);
    }
    /**
     * 预载入一个audio
     * @param key
     */
    function pre_audio(key) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = audios.get(key);
                        if (!!data.clip) return [3 /*break*/, 2];
                        _a = data;
                        return [4 /*yield*/, load_res(data.url, cc.AudioClip)];
                    case 1:
                        _a.clip = _b.sent();
                        data.fsm.try_go_state(data.clip ? "ok" : "error");
                        _b.label = 2;
                    case 2:
                        audios.set(key, data);
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 获取声音实例
     * @param key
     */
    function get_audio(key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pre_audio(key)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, audios.get(key)];
                }
            });
        });
    }
    /** 播放一个声音 */
    function play_audio(key) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_audio(key)];
                    case 1:
                        data = _a.sent();
                        if (data.fsm.is_state("error") ||
                            (data.type === "music" && !music_switch) ||
                            (data.type === "sound" && !sound_switch)) {
                            return [2 /*return*/];
                        }
                        data.id =
                            data.type === "music"
                                ? cc.audioEngine.playMusic(data.clip, true)
                                : cc.audioEngine.playEffect(data.clip, false);
                        return [2 /*return*/];
                }
            });
        });
    }
    /** 停止某一个声音 */
    function stop_audio(key) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_audio(key)];
                    case 1:
                        data = _a.sent();
                        if (data.fsm.is_state("error")) {
                            return [2 /*return*/];
                        }
                        data.id && cc.audioEngine.stop(data.id);
                        return [2 /*return*/];
                }
            });
        });
    }

    /**
     * 颜色模块
     * - 需要在编辑器中和运行时初始化
     */
    var colors;
    function _init_color(config) {
        if (config === void 0) { config = { none: "ffffff" }; }
        colors = config;
    }
    /**
     * 从配置中获取颜色，如果无颜色，则返回白色
     * @param color_key
     */
    function get_color(color_key) {
        if (colors[color_key]) {
            return cc.color().fromHEX(colors[color_key]);
        }
        else {
            log(exports.LogLevel.WARN, "\u83B7\u53D6color\u5931\u8D25\uFF0Ckey=" + color_key);
            return cc.Color.WHITE;
        }
    }
    /**
     * 设置节点颜色
     * @param node
     * @param color_key
     */
    function set_node_color(node, color_key) {
        node.color = get_color(color_key);
    }

    var metas;
    function _init_meta(config) {
        if (config === void 0) { config = {}; }
        metas = config;
    }
    /** meta基类，需要被继承 */
    var MetaBase = /** @class */ (function () {
        function MetaBase() {
        }
        MetaBase.get_meta_source = function (id) {
            if (id === void 0) { id = undefined; }
            var _a;
            var r = id ? (_a = metas === null || metas === void 0 ? void 0 : metas[this.meta_name]) === null || _a === void 0 ? void 0 : _a[id] : metas === null || metas === void 0 ? void 0 : metas[this.meta_name];
            !r && log(exports.LogLevel.WARN, "\u83B7\u53D6meta\u6E90\u6570\u636E\u5931\u8D25\uFF0Cmeta_name=" + this.meta_name + "\uFF0Cid=" + id);
            return r;
        };
        /** 创建meta类实例时，对传入的单行源数据进行处理 */
        MetaBase.prototype.use_special = function (s) { };
        /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
        MetaBase.prototype.use_default = function (id) {
            throw new Error("meta-id\u4E0D\u5B58\u5728\uFF0Cid=" + id);
        };
        return MetaBase;
    }());
    /**
     * 设置meta类的上下文信息
     * @param meta_name meta名
     */
    function DeSetMetaContext(meta_name) {
        return function (constructor) {
            constructor.meta_name = meta_name;
        };
    }
    /**
     * 获取单个的meta
     * @param meta_class
     * @param id
     */
    function get_meta(meta_class, id) {
        var meta = new meta_class();
        var source = meta_class.get_meta_source(id);
        source ? meta.use_special(source) : meta.use_default(id);
        return meta;
    }
    /**
     * 获取meta数组
     * @param meta_class
     */
    function get_metas(meta_class) {
        return Object.keys(meta_class.get_meta_source()).map(function (id) { return get_meta(meta_class, id); });
    }
    /**
     * 获取所有meta的id数组
     * @param meta_class
     */
    function get_metas_ids(meta_class) {
        return Object.keys(meta_class.get_meta_source());
    }
    // TODO 在2.4.0中，由于资源载入方式发生变化，这里也需要进行修改
    var AUTO_GENERATE_FILENAME = "csv/auto-generate.ts";
    var REGS = {
        // 注释行标记
        COMMENT: /^#/,
        // 属性行标记
        HEADER: /^@/,
        // 换行符
        NEW_LINE: /\r\n/g,
        // 单行中的块拆分正则
        LINE: /(?<=,|^)(("[^"]*")+|[^,]*)(?=,|$)/g,
    };
    /**
     * 解析csv文件为json对象
     * @param source csv文件内容
     */
    function _parse_csv(source) {
        // 属性行
        var headers = [];
        // 拆分行
        var lines = source.trim().split(REGS.NEW_LINE);
        // 处理行
        return lines.reduce(function (result, line) {
            line = line.trim();
            if (REGS.COMMENT.test(line) || line === "") ;
            else if (REGS.HEADER.test(line)) {
                // 属性行处理
                headers = line.match(REGS.LINE);
                headers[0] = headers[0].replace(REGS.HEADER, "");
            }
            else {
                // 内容行处理
                var pieces_1 = line.match(REGS.LINE);
                result[pieces_1[0]] = Object.fromEntries(headers.map(function (header, index) {
                    var _a, _b;
                    var fix_piece = (_b = (_a = pieces_1[index]) === null || _a === void 0 ? void 0 : _a.trim().replace(/^"|"$/g, "").replace(/""/g, '"')) !== null && _b !== void 0 ? _b : "";
                    return [header, fix_piece];
                }));
            }
            return result;
        }, {});
    }
    /**
     * 将resoueces/csv/路径下的所有csv文件，转换为同路径下的json文件
     */
    function parse_csv_all() {
        return __awaiter(this, void 0, void 0, function () {
            var url_target, url_source, files, file_texts, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url_target = to_editor_url(AUTO_GENERATE_FILENAME);
                        url_source = to_editor_url(cc.path.dirname(AUTO_GENERATE_FILENAME) + "/*.csv");
                        return [4 /*yield*/, new Promise(function (res) {
                                Editor.assetdb.queryAssets(url_source, "text", function (err, results) { return res(results); });
                            })];
                    case 1:
                        files = _a.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return load({ type: "uuid", uuid: file.uuid }); }))];
                    case 2:
                        file_texts = _a.sent();
                        json = file_texts.reduce(function (r, text) {
                            r[text.name] = _parse_csv(text.text);
                            return r;
                        }, {});
                        Editor.assetdb.createOrSave(url_target, "export const CONFIG_META=" + JSON.stringify(json), function (err) {
                            err
                                ? log(exports.LogLevel.ERROR, "生成csv的ts文件失败")
                                : log(exports.LogLevel.NORMAL, "写入csv的ts文件成功");
                        });
                        return [2 /*return*/];
                }
            });
        });
    }

    /**
     * 原生模块
     * - js与java间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html?h=java
     * - js与OC间的互相调用，参考：http://docs.cocos.com/creator/manual/zh/advanced-topics/oc-reflection.html
     */
    /** 入口封装类 */
    var GATE_CLASS = "JSBinding";
    /** android 平台的单独配置 */
    var ANDROID_CONFIG = {
        /** 类位置 */
        CLASS_PATH: "org/cocos2dx/javascript/",
        /** 方法签名 */
        METHOD_SIGNATURE: "(Ljava/lang/String;)Ljava/lang/String;",
    };
    /** 事件：原生回调游戏 */
    var EVENT_NATIVE_CALLBACK = "@event:native/native-callback";
    /** 原生给的回调结果，由回调id和回调结果组成 */
    var native_callbacks = new Map();
    /** 判断为android平台 */
    function is_android() {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID;
    }
    /** 判断为ios平台 */
    function is_ios() {
        return cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS;
    }
    /** 判断为原生平台 */
    function is_native() {
        return cc.sys.isNative;
    }
    /**
     * 调用原生
     * @param method 方法名
     * @param params 入参；如果是json字符串，请在外部手动传入
     */
    function call(method, params) {
        if (params === void 0) { params = {}; }
        var params_json = JSON.stringify(params);
        if (is_ios()) {
            log(exports.LogLevel.DEV, method, params_json);
            return jsb.reflection.callStaticMethod(GATE_CLASS, method + ":", params_json);
        }
        else if (is_android()) {
            log(exports.LogLevel.DEV, method, params_json);
            return jsb.reflection.callStaticMethod(ANDROID_CONFIG.CLASS_PATH + GATE_CLASS, method, ANDROID_CONFIG.METHOD_SIGNATURE, params_json);
        }
        else {
            // 非原生平台
            return;
        }
    }
    /**
     * 异步调用
     * - TODO：添加wait_time的作用
     * @param method 方法名
     * @param params 入参
     * @param wait_time 最大等待时间，默认为100s
     */
    function call_async(method, params, wait_time) {
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var call_id;
            return __generator(this, function (_a) {
                call_id = method + "/" + Date.now().toString(36) + "/" + Math.random().toFixed(5);
                // 通知原生
                call(method, Object.assign(params, { call_id: call_id }));
                // 监听回调
                return [2 /*return*/, new Promise(function (res) {
                        var t = {};
                        event_center.on(EVENT_NATIVE_CALLBACK, function () {
                            if (native_callbacks.has(call_id)) {
                                res(native_callbacks.get(call_id));
                                event_center.targetOff(t);
                                native_callbacks.delete(call_id);
                            }
                        }, t);
                    })];
            });
        });
    }
    /**
     * 原生调js的全局方法
     * @param call_id 调用id
     * @param call_result 调用结果
     */
    window["NativeCallback"] = function (call_id, call_result) {
        log(exports.LogLevel.DEV, "NativeCallback", call_id, call_result);
        native_callbacks.set(call_id, call_result);
        event_center.emit(EVENT_NATIVE_CALLBACK);
    };

    /**
     * 界面模块
     * - 需要在运行时初始化，传入父节点
     */
    /** 父节点 */
    var parent;
    /** 当前节点的 node.zIndex */
    var now_z_index = 0;
    /** 界面脚本的实现基类 */
    var PanelBase = /** @class */ (function (_super) {
        __extends(PanelBase, _super);
        function PanelBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return PanelBase;
    }(cc.Component));
    /**
     * 设置panel类上下文的装饰器
     * @param config
     */
    function DeSetPanelContext(path, type, z_index_base) {
        if (type === void 0) { type = "old"; }
        if (z_index_base === void 0) { z_index_base = 0; }
        return function (constructor) {
            constructor.context = {
                path: path,
                z_index_base: z_index_base,
                type: type,
                prefab: undefined,
                ins: undefined,
                state: new SimpleFSM("close", {
                    open: ["close"],
                    close: ["open"],
                }),
            };
        };
    }
    /**
     * 初始化系统，传入父节点
     * @param node
     */
    function _init_panel(node) {
        if (node === void 0) { node = new cc.Node(); }
        parent = node;
    }
    /**
     * 预载入界面 prefab
     * @param panel
     */
    function pre_panel(panel) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!panel.context.prefab) return [3 /*break*/, 2];
                        _a = panel.context;
                        return [4 /*yield*/, load_res(panel.context.path, cc.Prefab)];
                    case 1:
                        _a.prefab = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 获取界面实例，如果获取不到，则创建新的
     * @param panel
     */
    function get_panel(panel) {
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!panel.context.ins) return [3 /*break*/, 3];
                        return [4 /*yield*/, pre_panel(panel)];
                    case 1:
                        _a.sent();
                        node = cc.instantiate(panel.context.prefab);
                        node.parent = parent;
                        node.position = cc.Vec3.ZERO;
                        node.width = cc.winSize.width;
                        node.height = cc.winSize.height;
                        panel.context.ins = node.getComponent(panel);
                        return [4 /*yield*/, panel.context.ins.on_create()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, panel.context.ins];
                }
            });
        });
    }
    /**
     * 打开页面
     * @param panel
     * @param params
     */
    function open_panel(panel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var z_index, ins;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // 校验
                        if (!panel.context.state.try_go_state("open")) {
                            return [2 /*return*/];
                        }
                        z_index = (now_z_index += 1);
                        return [4 /*yield*/, get_panel(panel)];
                    case 1:
                        ins = _b.sent();
                        ins.node.zIndex = z_index + panel.context.z_index_base;
                        ins.node.active = true;
                        // 动画
                        return [4 /*yield*/, (_a = panel.context.ins).on_open.apply(_a, __spread(params))];
                    case 2:
                        // 动画
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 关闭页面
     * @param panel
     * @param params
     */
    function close_panel(panel) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // 校验
                        if (!panel.context.state.try_go_state("close")) {
                            return [2 /*return*/];
                        }
                        // 删除实例
                        return [4 /*yield*/, (_a = panel.context.ins).on_close.apply(_a, __spread(params))];
                    case 1:
                        // 删除实例
                        _b.sent();
                        if (panel.context.type === "new") {
                            panel.context.ins.node.destroy();
                            panel.context.ins = undefined;
                        }
                        else if (panel.context.type === "old") {
                            panel.context.ins.node.active = false;
                        }
                        return [2 /*return*/];
                }
            });
        });
    }

    /**
     * 工具函数模块
     * - 无特定分类
     */
    /**
     * 求一个数的正数模
     * @param n
     * @param mode
     */
    function get_positive_mode(n, mode) {
        return ((n % mode) + mode) % mode;
    }
    /**
     * 等待n秒
     * @param time 单位s
     */
    function do_delay(time) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, time * 1e3); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * 带参数的自定义模版字符串
     * @param template 自定义模板字符串，使用{index}来表示参数，index表示参数序号
     * @param params 多个参数
     * @example
     * ```
     * let template = "My name is {0}, my age is {1}, my sex is {2}."
     * let params = ["fy", "16"]
     * get_template_string(template, ...params)
     * // => My name is fy, my age is 16, my sex is {2}.
     * ```
     */
    function get_template_string(template) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return template.replace(/{([0-9]+)}/g, function (match, index) { var _a; return (_a = params[index]) !== null && _a !== void 0 ? _a : "{" + index + "}"; });
    }
    function is_string(x) {
        return typeof x === "string";
    }
    function is_number(x) {
        return typeof x === "number";
    }
    function is_boolean(x) {
        return typeof x === "boolean";
    }
    function is_function(x) {
        return typeof x === "function";
    }
    function is_object(x) {
        return typeof x === "object";
    }
    function is_symbol(x) {
        return typeof x === "symbol";
    }
    function is_bigint(x) {
        return typeof x === "bigint";
    }
    function is_undefined(x) {
        return typeof x === "undefined";
    }
    function is_array(x) {
        return x instanceof Array;
    }

    /**
     * 多语言模块
     * - 需要在编辑器中，运行时初始化，传入2个配置数据：ConfigLanguage，编辑器语言
     */
    /** 事件：语言更改 */
    var EVENT_LANGUAGE_CHANGE = "text/language-change";
    /** 配置 */
    var languages;
    /** 编辑器默认语言 */
    var editor_language;
    /**
     * 在编辑器中初始化 text 模块
     * @param config
     * @param editor 编辑器默认语言
     */
    function _init_text(config, editor) {
        if (config === void 0) { config = { chinese: {} }; }
        if (editor === void 0) { editor = "chinese"; }
        languages = config;
        editor_language = editor;
        !languages[editor_language] && log(exports.LogLevel.IMPORTANT_ERROR, "无法载入编辑器text语言");
    }
    /** 获取当前的语言 key */
    function get_language() {
        return get_local("language");
    }
    /**
     * 修改当前语言
     * @param new_language
     */
    function change_language(new_language) {
        set_local("language", new_language);
        event_center.emit(EVENT_LANGUAGE_CHANGE);
    }
    /**
     * 获取语言数据，如果获取失败，则返回 key
     * @param key
     * @param params
     */
    function get_text(key) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var language = CC_EDITOR ? editor_language : get_language();
        var text = languages[language][key];
        if (text) {
            return get_template_string.apply(void 0, __spread([text], params));
        }
        else {
            log(exports.LogLevel.ERROR, "key\u4E0D\u5B58\u5728, key=" + key);
            return key;
        }
    }
    /**
     * 设置节点的text数据
     * @param node
     * @param key
     * @param params
     */
    function set_node_text(node, key) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var result = get_text.apply(void 0, __spread([key], params));
        if (node.getComponent(cc.Label)) {
            node.getComponent(cc.Label).string = result;
            return;
        }
        if (node.getComponent(cc.RichText)) {
            node.getComponent(cc.RichText).string = result;
            return;
        }
        if (node.getComponent(cc.Sprite)) {
            load_res(result, cc.SpriteFrame).then(function (v) {
                node.getComponent(cc.Sprite).spriteFrame = v;
            });
            return;
        }
    }

    /**
     * 时间模块
     * - 缩写
     *    - MS 毫秒
     *    - S 秒
     *    - M 分钟
     *    - H 小时
     *    - D 天
     */
    /**
     * 检查输入参数的合理性
     * @param input
     */
    function check_time_input(input) {
        var REG = /^[0-9]+\.?[0-9]*(ms|s|m|h|d)$/g;
        return (is_string(input) && REG.test(input)) || is_number(input);
    }
    /** 微秒的模 */
    var MS_MODE = 1000;
    /** 秒的模 */
    var S_MODE = 60;
    /** 分钟的模 */
    var M_MODE = 60;
    /** 小时的模 */
    var H_MODE = 24;
    /** 1s = 1000ms */
    var S_MS = MS_MODE;
    /** 1min = 60000ms */
    var M_MS = S_MODE * S_MS;
    /** 1hour = 3600000ms */
    var H_MS = M_MODE * M_MS;
    /** 1day = 86400000ms */
    var D_MS = H_MODE * H_MS;
    /**
     * 将字符串转为毫秒
     * @param source
     * @example
     */
    function to_ms(source) {
        if (!check_time_input(source)) {
            log(exports.LogLevel.ERROR, "\u8F6C\u4E49\u9519\u8BEF\uFF0Cfunc=\"to_ms\"\uFF0Csource=" + source);
            return;
        }
        if (is_string(source)) {
            var count = Number.parseFloat(source);
            if (/ms$/.test(source)) {
                return count;
            }
            if (/s$/.test(source)) {
                return count * S_MS;
            }
            if (/m$/.test(source)) {
                return count * M_MS;
            }
            if (/h$/.test(source)) {
                return count * H_MS;
            }
            if (/d$/.test(source)) {
                return count * D_MS;
            }
        }
        else {
            return source;
        }
    }
    function to_group(source) {
        var ms = to_ms(source);
        var ms_fix = get_positive_mode(ms, MS_MODE);
        var s = Math.floor(ms / S_MS);
        var s_fix = get_positive_mode(s, S_MODE);
        var m = Math.floor(ms / M_MS);
        var m_fix = get_positive_mode(m, M_MODE);
        var h = Math.floor(ms / H_MS);
        var h_fix = get_positive_mode(h, H_MODE);
        return { ms: ms, ms_fix: ms_fix, s: s, s_fix: s_fix, m: m, m_fix: m_fix, h: h, h_fix: h_fix };
    }
    /**
     * 将给定微秒数格式化
     * @param ms 微秒数
     * @param zero 是否显示为0的值
     * @example
     * ```
     * to_show(888888888); //-> 246:54:48
     * to_show(8888888); //-> 02:28:08
     * to_show(88888); //-> 00:01:28
     * to_show(88888, false); //-> 01:28
     * ```
     */
    function to_show(source, zero) {
        if (zero === void 0) { zero = true; }
        var group = to_group(source);
        var r = [group.h, group.m_fix, group.s_fix];
        // 过滤
        if (!zero) {
            while (r[0] === 0 && r.length > 1) {
                r.shift();
            }
        }
        return r.length === 1 ? r.join("") : r.map(function (v) { return v.toString().padStart(2, "0"); }).join(":");
    }
    /**
     * 显示为时间字符串
     * @param source
     * @example
     * ```
     * to_timestring(1589974698751); //-> "19:38:18 GMT+0800 (中国标准时间)"
     * ```
     */
    function to_timestring(source) {
        return new Date(to_ms(source)).toTimeString();
    }
    /**
     * 获取给定时间的天序号
     * @param ms
     */
    function get_day(ms) {
        if (ms === void 0) { ms = Date.now(); }
        return Math.floor(ms / D_MS);
    }

    var time = /*#__PURE__*/Object.freeze({
        __proto__: null,
        S_MS: S_MS,
        M_MS: M_MS,
        H_MS: H_MS,
        D_MS: D_MS,
        to_ms: to_ms,
        to_group: to_group,
        to_show: to_show,
        to_timestring: to_timestring,
        get_day: get_day
    });

    (function (SimpleNodeAnima) {
        /** 保存在node上的状态存储 */
        var KEY_STATES = Symbol();
        /** 保存在node上的当前状态 */
        var KEY_STATE_NOW = Symbol();
        /**
         * 设置节点的状态信息
         * @param node
         * @param init_state
         * @param states
         */
        function set_all(node, init_state, states) {
            node[KEY_STATES] = states;
            node[KEY_STATE_NOW] = init_state;
            no_anima(node, init_state);
        }
        SimpleNodeAnima.set_all = set_all;
        /**
         * 获取当前的节点动画状态
         * @param node
         */
        function get_now(node) {
            return node[KEY_STATE_NOW];
        }
        SimpleNodeAnima.get_now = get_now;
        /**
         * 无动画，直接至某个节点为某个状态
         * @param node
         * @param to
         */
        function no_anima(node, to) {
            node[KEY_STATE_NOW] = to;
            cc.tween(node).set(node[KEY_STATES][to]).start();
        }
        SimpleNodeAnima.no_anima = no_anima;
        /**
         * 动画：从目前状态通过动画迁移到目标状态
         * @param node
         * @param to 目标状态的key
         * @param params 动画参数
         */
        function anima(node, to, params) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            params.time = (_a = params.time) !== null && _a !== void 0 ? _a : 0.3;
                            params.delay = (_b = params.delay) !== null && _b !== void 0 ? _b : 0;
                            params.ease = (_c = params.ease) !== null && _c !== void 0 ? _c : "linear";
                            node[KEY_STATE_NOW] = to;
                            return [4 /*yield*/, new Promise(function (res) {
                                    cc.tween(node)
                                        .delay(params.delay)
                                        .to(params.time, node[KEY_STATES][to], { easing: params.ease })
                                        .call(res)
                                        .start();
                                })];
                        case 1:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        SimpleNodeAnima.anima = anima;
    })(exports.SimpleNodeAnima || (exports.SimpleNodeAnima = {}));

    /**
     * 工具函数模块
     * - 与随机数相关的函数
     */
    /**
     * 获取一个随机值
     * @param min
     * @param max
     * @param floating 为true则表示返回整数，默认为false
     * @deprecated 建议使用lodash.random代替
     */
    function random(min, max, floating) {
        if (floating === void 0) { floating = false; }
        if (floating) {
            return Math.random() * (max - min) + min;
        }
        else {
            min = Math.ceil(min);
            max = Math.ceil(max);
            return Math.floor(Math.random() * (max - min) + min);
        }
    }
    /**
     * 获取一个随机数组项，概率相同
     * @param array
     * @deprecated 建议使用lodash.sample代替
     */
    function random_array_item(array) {
        return array[Math.trunc(Math.random() * array.length)];
    }
    /**
     * 根据概率数组获取随机index
     * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
     * @param prob_array 概率数组
     */
    function random_prob(prob_array) {
        // 获取随机数
        var r = Math.random();
        // 对概率数组的处理
        var s = prob_array
            .map(function (v, index) {
            return { index: index, prob: v };
        })
            .sort(function (a, b) { return a.prob - b.prob; });
        // 判断随机位置
        var result = s.find(function (v) { return (r -= v.prob) <= 0; });
        return result ? result.index : s.length - 1;
    }
    /**
     * 随机1次，判断是否满足给定概率
     * @param prob
     */
    function is_prob(prob) {
        return Math.random() <= prob;
    }
    /**
     * 随机位置
     * @param r
     */
    function random_position(r) {
        return cc.v3(random(-r, r, true), random(-r, r, true));
    }

    var version = "1.0.0";

    /** 框架版本号 */
    var VERSION = version;
    /**
     * 初始化框架
     * @param config
     */
    function init(config) {
        _init_log(config.log_level);
        _init_version(config.version, config.version_info);
        _init_local(config.local);
        _init_text(config.text, config.editor_language);
        _init_color(config.color);
        _init_audio(config.audio);
        _init_panel(config.panel_parent);
        _init_meta(config.meta);
        !CC_EDITOR && log(exports.LogLevel.DEV, "初始化框架成功", VERSION, config);
    }

    exports.DeDevConsole = DeDevConsole;
    exports.DeDevConsoleNamespace = DeDevConsoleNamespace;
    exports.DeSetMetaContext = DeSetMetaContext;
    exports.DeSetPanelContext = DeSetPanelContext;
    exports.EVENT_LANGUAGE_CHANGE = EVENT_LANGUAGE_CHANGE;
    exports.EVENT_MUSIC_SWITCH_OPEN = EVENT_MUSIC_SWITCH_OPEN;
    exports.MetaBase = MetaBase;
    exports.PanelBase = PanelBase;
    exports.SimpleFSM = SimpleFSM;
    exports.StateTable = StateTable;
    exports.Time = time;
    exports.VERSION = VERSION;
    exports._init_audio = _init_audio;
    exports._init_color = _init_color;
    exports._init_local = _init_local;
    exports._init_log = _init_log;
    exports._init_meta = _init_meta;
    exports._init_panel = _init_panel;
    exports._init_text = _init_text;
    exports._init_version = _init_version;
    exports._parse_csv = _parse_csv;
    exports.adjust_canvas = adjust_canvas;
    exports.call = call;
    exports.call_async = call_async;
    exports.change_language = change_language;
    exports.circleCircle = circleCircle;
    exports.close_panel = close_panel;
    exports.do_delay = do_delay;
    exports.do_schedule = do_schedule;
    exports.do_widget = do_widget;
    exports.do_widget_all = do_widget_all;
    exports.event_center = event_center;
    exports.get_audio = get_audio;
    exports.get_color = get_color;
    exports.get_filename = get_filename;
    exports.get_language = get_language;
    exports.get_local = get_local;
    exports.get_meta = get_meta;
    exports.get_metas = get_metas;
    exports.get_metas_ids = get_metas_ids;
    exports.get_music_switch = get_music_switch;
    exports.get_node_childs = get_node_childs;
    exports.get_node_wp = get_node_wp;
    exports.get_positive_mode = get_positive_mode;
    exports.get_sound_switch = get_sound_switch;
    exports.get_template_string = get_template_string;
    exports.get_text = get_text;
    exports.init = init;
    exports.is_android = is_android;
    exports.is_array = is_array;
    exports.is_bigint = is_bigint;
    exports.is_boolean = is_boolean;
    exports.is_function = is_function;
    exports.is_ios = is_ios;
    exports.is_native = is_native;
    exports.is_number = is_number;
    exports.is_object = is_object;
    exports.is_prob = is_prob;
    exports.is_string = is_string;
    exports.is_symbol = is_symbol;
    exports.is_undefined = is_undefined;
    exports.lineLine = lineLine;
    exports.linePolygon = linePolygon;
    exports.lineRect = lineRect;
    exports.load = load;
    exports.load_res = load_res;
    exports.load_res_dir = load_res_dir;
    exports.log = log;
    exports.open_panel = open_panel;
    exports.parse_csv_all = parse_csv_all;
    exports.play_audio = play_audio;
    exports.pointInCircle = pointInCircle;
    exports.pointInPolygon = pointInPolygon;
    exports.pointLineDistance = pointLineDistance;
    exports.polygonCircle = polygonCircle;
    exports.polygonPolygon = polygonPolygon;
    exports.pre_audio = pre_audio;
    exports.pre_panel = pre_panel;
    exports.random = random;
    exports.random_array_item = random_array_item;
    exports.random_position = random_position;
    exports.random_prob = random_prob;
    exports.rectPolygon = rectPolygon;
    exports.rectRect = rectRect;
    exports.reverse_music_switch = reverse_music_switch;
    exports.reverse_sound_switch = reverse_sound_switch;
    exports.set_local = set_local;
    exports.set_node_by_wp = set_node_by_wp;
    exports.set_node_color = set_node_color;
    exports.set_node_text = set_node_text;
    exports.stop_audio = stop_audio;
    exports.to_editor_url = to_editor_url;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
