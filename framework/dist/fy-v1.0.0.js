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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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
     * 简单事件模块
     * - 暂时使用cc.EventTarget()作为处理中心
     */
    (function (FEvent) {
        FEvent.center = new cc.EventTarget();
    })(exports.FEvent || (exports.FEvent = {}));

    (function (FState) {
        /**
         * 状态表
         */
        var StateTable = /** @class */ (function () {
            function StateTable(source) {
                /** 存储 */
                this.source = new Map();
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
            /**
             * 获取全部状态
             */
            StateTable.prototype.get_all = function () {
                return this.source;
            };
            /**
             * 新增某个状态
             * @param key
             * @param value
             */
            StateTable.prototype.add = function (key, value) {
                if (value === void 0) { value = null; }
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
            /** 输出所有的状态key */
            StateTable.prototype.log_keys = function () {
                return "" + this.source.keys();
            };
            return StateTable;
        }());
        FState.StateTable = StateTable;
        /**
         * 简单有限状态机：simple finite state machine
         * - 【string标记】使用string作为状态（state）的标记
         * - 【锁定机制】在执行事件过渡动作时，整个状态机处于锁定状态
         */
        var SFSM = /** @class */ (function () {
            function SFSM(config) {
                this.id = config.id;
                this.state = config.initial;
                this.states = config.states;
                this.is_lock = false;
            }
            /** 锁定状态机 */
            SFSM.prototype.lock = function () {
                this.is_lock = true;
            };
            /** 解锁状态机 */
            SFSM.prototype.unlock = function () {
                this.is_lock = false;
            };
            /** 是否处于某个状态中 */
            SFSM.prototype.is_state = function () {
                var states = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    states[_i] = arguments[_i];
                }
                return states.includes(this.state);
            };
            /** is_state的lock版本 */
            SFSM.prototype.is_state_with_lock = function () {
                var states = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    states[_i] = arguments[_i];
                }
                return this.is_state.apply(this, __spread(states)) && !this.is_lock;
            };
            /** 是否可以去到下个状态 */
            SFSM.prototype.can_go_state = function (state) {
                return this.states[this.state].includes(state);
            };
            /** can_go_state的lock版本 */
            SFSM.prototype.can_go_state_with_lock = function (state) {
                return this.can_go_state(state) && !this.is_lock;
            };
            /** 尝试去到下个状态 */
            SFSM.prototype.try_go_state = function (state) {
                if (this.can_go_state(state)) {
                    this.state = state;
                    return true;
                }
                else {
                    return false;
                }
            };
            /** try_go_state的lock版本 */
            SFSM.prototype.try_go_state_with_lock = function (state) {
                if (this.can_go_state_with_lock(state)) {
                    this.state = state;
                    return true;
                }
                else {
                    return false;
                }
            };
            return SFSM;
        }());
        FState.SFSM = SFSM;
        /**
         * 简单节点动画
         */
        var SimpleNodeAnima = /** @class */ (function () {
            function SimpleNodeAnima() {
            }
            /**
             * 设置节点的状态信息
             * @param node
             * @param state
             */
            SimpleNodeAnima.set_all = function (node, states, init_state) {
                node[SimpleNodeAnima.SAVE_KEY] = states;
                init_state && this.no_anima(node, init_state);
            };
            /**
             * 无动画，直接至某个节点为某个状态
             * @param node
             * @param to
             */
            SimpleNodeAnima.no_anima = function (node, to) {
                cc.tween(node)
                    .set(node[SimpleNodeAnima.SAVE_KEY][to])
                    .start();
            };
            /**
             * 动画：从目前状态通过动画迁移到目标状态
             * @param node
             * @param to 目标状态的key
             * @param params 动画参数
             */
            SimpleNodeAnima.anima = function (node, to, params) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (params.time === undefined) {
                                    params.time = 0.3;
                                }
                                if (params.delay === undefined) {
                                    params.delay = 0;
                                }
                                if (params.ease === undefined) {
                                    params.ease = "linear";
                                }
                                return [4 /*yield*/, new Promise(function (res) {
                                        cc.tween(node)
                                            .delay(params.delay)
                                            .to(params.time, node[SimpleNodeAnima.SAVE_KEY][to], { easing: params.ease })
                                            .call(res)
                                            .start();
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            /** 保存在node上的key */
            SimpleNodeAnima.SAVE_KEY = Symbol();
            return SimpleNodeAnima;
        }());
        FState.SimpleNodeAnima = SimpleNodeAnima;
    })(exports.FState || (exports.FState = {}));

    (function (FVersion) {
        /** 版本管理模块输出tag */
        var TAG = "@FVersion:";
        /**
         * 需要在app中初始化，并传入版本信息
         * @param data_version 版本标记信息
         * @param data_version_info 版本额外信息
         */
        FVersion.init = function (data_version, data_version_info) {
            FVersion.version = new exports.FState.StateTable(Object.entries(data_version).reduce(function (r, _a) {
                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                v && (r[k] = v);
                return r;
            }, {}));
            cc.log(TAG, FVersion.version.log_keys(), JSON.stringify(data_version_info));
        };
        /** dev模式下全局变量；针对类的装饰器 */
        FVersion.dev_console = function (constructor) {
            CC_DEV && (window[constructor.name] = constructor);
        };
        /** dev模式下全局变量；针对模块 */
        FVersion.dev_console_namespace = function (name, namespace) {
            CC_DEV && (window[name] = namespace);
        };
    })(exports.FVersion || (exports.FVersion = {}));

    (function (FLocal) {
        /** 缓存 */
        var cache = new Map();
        /** 默认值 */
        var defaults;
        /** 初始化，如果是开发版本则一直初始化 */
        FLocal.init = function (config) {
            cache = new Map();
            defaults = config;
            exports.FVersion.version.has("resetLocal") && cc.sys.localStorage.clear();
        };
        /** 获取，顺序为：缓存，本地存储，配置的默认值 */
        FLocal.get = function (key) {
            var _a, _b;
            var value = (_b = (_a = cache.get(key)) !== null && _a !== void 0 ? _a : cc.sys.localStorage.getItem(key)) !== null && _b !== void 0 ? _b : "" + defaults[key];
            cache.set(key, value);
            return value;
        };
        /** 存储 */
        FLocal.set = function (key, value) {
            cache.set(key, value);
            Promise.resolve().then(function () {
                cc.sys.localStorage.setItem(key, value);
            });
        };
    })(exports.FLocal || (exports.FLocal = {}));

    (function (FTool) {
        var _this = this;
        /** 输出log */
        var TAG = "@FTool:";
        /**
         * 获取一个随机数组项，概率相同
         * @param array
         */
        FTool.get_random_array_item = function (array) {
            return array[Math.trunc(Math.random() * array.length)];
        };
        /**
         * 根据概率数组获取随机index
         * - 从小到大排序，如果概率之和不为1，则会填充不足1的部分，或削减超过1的部分
         * @param prob_array 概率数组
         */
        FTool.get_random_prob = function (prob_array) {
            // 获取随机数
            var r = Math.random();
            // 对概率数组的处理
            var s = prob_array
                .map(function (v, index) { return { index: index, prob: v }; })
                .sort(function (a, b) { return a.prob - b.prob; });
            // 判断随机位置
            var result = s.find(function (v) { return (r -= v.prob) <= 0; });
            return result ? result.index : s.length - 1;
        };
        /**
         * 随机1次，判断是否满足给定概率
         * @param prob
         */
        FTool.is_prob = function (prob) {
            return Math.random() <= prob;
        };
        /**
         * 求一个数的正数模
         * @param n
         * @param mode
         */
        FTool.get_positive_mode = function (n, mode) {
            return (n % mode + mode) % mode;
        };
        /**
         * 刷新给定节点的widget
         * @param node
         */
        FTool.do_widget = function (node) {
            var w = node.getComponent(cc.Widget);
            if (w && w.enabled) {
                w.updateAlignment();
                if (w.alignMode === cc.Widget.AlignMode.ONCE
                    || w.alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                    w.enabled = false;
                }
            }
        };
        /**
         * 刷新给定节点下所有的widget
         * @param node
         */
        FTool.do_widget_all = function (node) {
            node.getComponentsInChildren(cc.Widget).forEach(function (w) {
                if (w && w.enabled) {
                    w.updateAlignment();
                    if (w.alignMode === cc.Widget.AlignMode.ONCE
                        || w.alignMode === cc.Widget.AlignMode.ON_WINDOW_RESIZE) {
                        w.enabled = false;
                    }
                }
            });
        };
        /**
         * 间隔帧执行
         * @param f 执行函数
         * @param ccc 执行组件
         * @param all_count 总计数
         * @param interval 间隔帧；默认为1，表示连续执行
         */
        FTool.do_with_frame = function (f, ccc, all_count, interval) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) {
                            var count = (all_count - 1) * interval; // 执行总帧数
                            var frame_index = 0; // 帧index
                            var f_index = 0; // 函数执行index
                            ccc.schedule(function () {
                                if (frame_index % interval === 0) {
                                    f(f_index);
                                    f_index += 1;
                                }
                                frame_index += 1;
                                frame_index > count && res();
                            }, 0, count);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * 获取节点的世界坐标
         * @param node
         */
        FTool.get_node_wp = function (node) {
            return node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        };
        /**
         * 根据世界坐标设置节点本地坐标
         * @param node
         * @param wp
         * @param flag 是否设置，默认为false，则只获取坐标而不设置坐标
         */
        FTool.set_node_by_wp = function (node, wp, flag) {
            if (flag === void 0) { flag = false; }
            var lp = node.parent.convertToNodeSpaceAR(wp);
            flag && (node.position = lp);
            return lp;
        };
        /**
         * 等待n秒
         * @param time 单位s
         */
        FTool.wait_time = function (time) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, time * 1e3); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * 等待执行
         * @param f_do 执行函数
         * @param f_is 判定函数
         * @param wait_all 最高等待时间
         * @param wait_interval 等待间隔
         */
        FTool.wait_for_do = function (f_do, f_is, wait_all, wait_interval) {
            if (wait_all === void 0) { wait_all = 5; }
            if (wait_interval === void 0) { wait_interval = 0.5; }
            return __awaiter(_this, void 0, void 0, function () {
                var time, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            time = 0;
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < 100)) return [3 /*break*/, 5];
                            if (!!!f_is()) return [3 /*break*/, 2];
                            f_do();
                            return [3 /*break*/, 5];
                        case 2:
                            time += wait_interval;
                            if (time >= wait_all) {
                                return [3 /*break*/, 5];
                            }
                            return [4 /*yield*/, FTool.wait_time(wait_interval)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            i += 1;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
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
        FTool.get_template_string = function (template) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            return template.replace(/\{([0-9]+?)\}/g, function (match, index) { var _a; return (_a = params[index]) !== null && _a !== void 0 ? _a : "{" + index + "}"; });
        };
        /**
         * 载入单个资源
         * - 既可以在editor中载入，也可以在运行时载入，但载入方式有差异
         * - 如果无此资源，则报错并返回null
         * - 【注意】运行时载入时无需传入文件后缀名，编辑器中载入需要有后缀名
         * - 【注意】在编辑器中载入
         * @param path
         * @param type
         */
        FTool.load_res = function (path, type) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) {
                            if (CC_EDITOR) {
                                // 在编辑器中载入
                                var url = "db://assets/resources/" + path;
                                // 针jpg和png资源完善路径
                                if (new cc.SpriteFrame() instanceof type) {
                                    url = url + "/" + FTool.get_filename(url);
                                }
                                var uuid = Editor.assetdb.remote.urlToUuid(url);
                                cc.loader.load({ type: "uuid", uuid: uuid }, function (err, resource) {
                                    err && cc.warn(TAG, "\u8F7D\u5165\u8D44\u6E90\u5931\u8D25, path=" + path + ", err=" + err);
                                    err ? res(null) : res(resource);
                                });
                            }
                            else {
                                // 运行时载入
                                // 后缀名处理：去掉后缀名
                                path = FTool.get_filepath(path) + FTool.get_filename(path);
                                cc.loader.loadRes(path, type, function (err, resource) {
                                    err && cc.warn(TAG, "\u8F7D\u5165\u8D44\u6E90\u5931\u8D25, path=" + path + ", err=" + err);
                                    err ? res(null) : res(resource);
                                });
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * 载入dir资源
         * - 【注意】编辑器中的载入顺序与打包之后的载入顺序不同（不同的打包平台顺序也不同）,因此在载入完成后需要对数组排序进行处理
         * @param path
         * @param type
         */
        FTool.load_res_dir = function (path, type) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) {
                            cc.loader.loadResDir(path, type, function (err, resource) {
                                err && cc.warn(TAG, "\u8F7D\u5165\u8D44\u6E90\u7EC4\u5931\u8D25, path=" + path + ", err=" + err);
                                err ? res(null) : res(resource);
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        // cc.Intersection
        FTool.lineLine = cc.Intersection.lineLine;
        FTool.lineRect = cc.Intersection.lineRect;
        FTool.linePolygon = cc.Intersection.linePolygon;
        FTool.rectRect = cc.Intersection.rectRect;
        FTool.rectPolygon = cc.Intersection.rectPolygon;
        FTool.polygonPolygon = cc.Intersection.polygonPolygon;
        FTool.polygonCircle = cc.Intersection.polygonCircle;
        FTool.circleCircle = cc.Intersection.circleCircle;
        FTool.pointInPolygon = cc.Intersection.pointInPolygon;
        FTool.pointLineDistance = cc.Intersection.pointLineDistance;
        FTool.pointInCircle = function (point, circle) {
            return point.sub(circle.position).len() <= circle.radius;
        };
        /**
         * 获取url路径中的路径部分
         * @param path
         * @example
         * ```
         * let path = "resources/icon/test.png"
         * get_filepath(path)
         * //=> resources/icon/
         * ```
         */
        FTool.get_filepath = function (path) {
            var r = path.match(/.+(?=\/[^\/]+$)/);
            return r ? r[0] : "";
        };
        /**
         * 获取url路径中的文件名部分
         * @param path
         * @example
         * ```
         * let path = "resources/icon/test.png"
         * get_filename(path)
         * //=> test
         * ```
         */
        FTool.get_filename = function (path) {
            var r = path.match(/[^\/]+(?=\.[^\.]+$)/);
            return r ? r[0] : "";
        };
        /**
         * 获取url路径中的文件后缀名部分
         * @param path
         * @example
         * ```
         * let path = "resources/icon/test.png"
         * get_extname(path)
         * //=> .png
         * ```
         */
        FTool.get_extname = function (path) {
            var r = path.match(/\.[^\.]+$/);
            return r ? r[0] : "";
        };
    })(exports.FTool || (exports.FTool = {}));

    (function (FAudio) {
        var _this = this;
        /** 事件，打开音乐开关 */
        FAudio.EVENT_OPEN_MUSIC_SWITCH = "@FAudio/open_music_switch";
        /**
         * 初始化
         * @param config
         */
        FAudio.init = function (config) {
            audio_all = new Map(Object.entries(config).map(function (_a) {
                var _b = __read(_a, 2), k = _b[0], v = _b[1];
                var ins = {
                    fsm: new exports.FState.SFSM({
                        id: "AudioSFSM",
                        initial: "prepare",
                        states: {
                            "prepare": ["ok", "error"],
                            "ok": [],
                            "error": [],
                        }
                    }),
                    type: k.includes("###") ? "music" : "sound",
                    url: v,
                };
                // TODO：设置单实例，可能会有bug，需要测试
                cc.audioEngine.setMaxAudioInstance(1);
                return [k, ins];
            }));
            music_switch = exports.FLocal.get("music") === "true";
            sound_switch = exports.FLocal.get("sound") === "true";
        };
        /** 所有声音的实例信息 */
        var audio_all = new Map();
        /** 音乐开关 */
        var music_switch; // 音乐开关
        /** 音效开关 */
        var sound_switch; // 音效开关
        /** 保存到本地 */
        function save() {
            exports.FLocal.set("music", "" + music_switch);
            exports.FLocal.set("sound", "" + sound_switch);
        }
        /** 获取音乐开关 */
        FAudio.get_music_switch = function () { return music_switch; };
        /** 反向音乐开关 */
        FAudio.reverse_music = function () {
            music_switch = !music_switch;
            music_switch
                ? exports.FEvent.center.emit(FAudio.EVENT_OPEN_MUSIC_SWITCH)
                : cc.audioEngine.stopAll();
            save();
        };
        /** 获取音效开关 */
        FAudio.get_sound_switch = function () { return sound_switch; };
        /** 反向音乐开关 */
        FAudio.reverse_sound = function () {
            sound_switch = !sound_switch;
            save();
        };
        /**
         * 获取声音实例
         * @param key
         */
        var get_audio_ins = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var data, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = audio_all.get(key);
                        if (!!data.clip) return [3 /*break*/, 2];
                        _a = data;
                        return [4 /*yield*/, exports.FTool.load_res(data.url, cc.AudioClip)];
                    case 1:
                        _a.clip = _b.sent();
                        data.fsm.try_go_state(data.clip ? "ok" : "error");
                        _b.label = 2;
                    case 2:
                        audio_all.set(key, data);
                        return [2 /*return*/, data];
                }
            });
        }); };
        /** 播放一个声音 */
        FAudio.play = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_audio_ins(key)];
                    case 1:
                        data = _a.sent();
                        if (data.fsm.is_state("error")) {
                            return [2 /*return*/];
                        }
                        if (data.type === "music" && !music_switch) {
                            return [2 /*return*/];
                        }
                        if (data.type === "sound" && !sound_switch) {
                            return [2 /*return*/];
                        }
                        data.id = data.type === "music"
                            ? cc.audioEngine.playMusic(data.clip, true)
                            : cc.audioEngine.playEffect(data.clip, false);
                        return [2 /*return*/];
                }
            });
        }); };
        /** 停止某一个声音 */
        FAudio.stop = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_audio_ins(key)];
                    case 1:
                        data = _a.sent();
                        if (data.fsm.is_state("error")) {
                            return [2 /*return*/];
                        }
                        data.id && cc.audioEngine.stop(data.id);
                        return [2 /*return*/];
                }
            });
        }); };
    })(exports.FAudio || (exports.FAudio = {}));

    /**
     * 颜色管理模块
     * - 使用key-value形式存储，其中value为颜色的hex值，前6位表示颜色，后2位表示透明度，后2位省略表示透明度为255
     * - 【参考资料】 Ant-design推荐的颜色设计：https://ant.design/docs/spec/colors-cn
     */
    (function (FColor) {
        /** 输出log */
        var TAG = "@FColor:";
        /**
         * 需要在运行时初始化
         * @param config
         */
        FColor.init = function (config) {
            data = config;
        };
        /**
         * 需要在编辑器中初始化
         * @param config
         */
        FColor.init_editor = function (config) {
            CC_EDITOR && (data = config);
        };
        var data;
        /**
         * 从配置中获取颜色，如果无颜色，则返回白色
         * @param color_key
         */
        FColor.get_color = function (color_key) {
            if (data[color_key]) {
                return cc.color().fromHEX(data[color_key]);
            }
            else {
                cc.warn(TAG, "\u83B7\u53D6color\u5931\u8D25\uFF0Ckey=" + color_key);
                return cc.Color.WHITE;
            }
        };
    })(exports.FColor || (exports.FColor = {}));

    (function (FHttp) {
        var _this = this;
        /**
         * fetch+get+json
         * @param url
         */
        FHttp.fetch_get_json = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var response, json, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(url, {
                                method: "GET",
                                mode: "cors",
                                headers: new Headers({ "Content-Type": "application/json" }),
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        return [2 /*return*/, json];
                    case 3:
                        error_1 = _a.sent();
                        cc.error(error_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * fetch+post+json
         * @param url
         * @param body
         */
        FHttp.fetch_post_json = function (url, body) { return __awaiter(_this, void 0, void 0, function () {
            var response, json, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(url, {
                                method: "POST",
                                mode: "cors",
                                headers: new Headers({ "Content-Type": "application/json" }),
                                body: JSON.stringify(body)
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        return [2 /*return*/, json];
                    case 3:
                        error_2 = _a.sent();
                        cc.error(error_2);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * XMLHttpRequest+get+json
         * @param url
         */
        FHttp.xhr_get_json = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) {
                            try {
                                var xhr_1 = new XMLHttpRequest();
                                xhr_1.responseType = "json";
                                xhr_1.open("GET", url, true);
                                xhr_1.setRequestHeader("Content-Type", "application/json");
                                xhr_1.onerror = function () { throw new Error("xhr-on-error"); };
                                xhr_1.ontimeout = function () { throw new Error("xhr-on-timeout"); };
                                xhr_1.onreadystatechange = function () {
                                    if (xhr_1.readyState != 4) {
                                        return;
                                    }
                                    if (xhr_1.status >= 200 && xhr_1.status < 400) {
                                        res(xhr_1.response);
                                    }
                                    else {
                                        throw new Error("xhr-status-not-200-400");
                                    }
                                };
                                xhr_1.send();
                            }
                            catch (error) {
                                cc.error(error);
                                res(null);
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * XMLHttpRequest+post+json
         * @param url
         * @param body
         */
        FHttp.xhr_post_json = function (url, body) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res) {
                            try {
                                var xhr_2 = new XMLHttpRequest();
                                xhr_2.responseType = "json";
                                xhr_2.open("POST", url, true);
                                xhr_2.setRequestHeader("Content-Type", "application/json");
                                xhr_2.onerror = function () { throw new Error("xhr-on-error"); };
                                xhr_2.ontimeout = function () { throw new Error("xhr-on-timeout"); };
                                xhr_2.onreadystatechange = function () {
                                    if (xhr_2.readyState != 4) {
                                        return;
                                    }
                                    if (xhr_2.status >= 200 && xhr_2.status < 400) {
                                        res(xhr_2.response);
                                    }
                                    else {
                                        throw new Error("xhr-status-not-200-400");
                                    }
                                };
                                xhr_2.send(JSON.stringify(body));
                            }
                            catch (error) {
                                cc.error(error);
                                res(null);
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
    })(exports.FHttp || (exports.FHttp = {}));

    (function (FMeta) {
        var _this = this;
        /** 输出log */
        var TAG = "@FMeta:";
        /**
         * 在编辑器中载入json文件
         * - TODO: 需要思考是否需要
         * @param file
         */
        FMeta.init_editor_async = function (file) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(CC_EDITOR && Object.keys(json).length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, exports.FTool.load_res(file, cc.JsonAsset)];
                    case 1:
                        json = (_a.sent()).json;
                        cc.log(TAG, "在编辑器中载入json资源", json);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        FMeta.init_async = function (file) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exports.FTool.load_res(file, cc.JsonAsset)];
                    case 1:
                        json = (_a.sent()).json;
                        cc.log(TAG, "meta资源载入成功", json);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        cc.error(TAG, "meta资源载入失败，请重新载入", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        /** json数据内容 */
        var json = {};
        /** meta的基础类 */
        var MetaBase = /** @class */ (function () {
            function MetaBase() {
            }
            /** 在获取时初始化 */
            MetaBase.get_meta_merge = function () {
                if (!this.meta_merge) {
                    this.meta_merge = this.meta_names.reduce(function (r, name) {
                        r = __assign({}, json[name]);
                        return r;
                    }, {});
                }
                return this.meta_merge;
            };
            /** 创建meta类实例时，对传入的单行源数据进行处理 */
            MetaBase.prototype.use_special = function (s) { };
            /** 创建meta类实例时，如果没有源数据，则设置为给定的默认值 */
            MetaBase.prototype.use_default = function (id) { };
            /** 临时存储的合并表，合并多个表的内容 */
            MetaBase.meta_merge = null;
            return MetaBase;
        }());
        FMeta.MetaBase = MetaBase;
        /**
         * 设置meta类上下文的装饰器函数
         * @param meta_names
         */
        FMeta.SetMetaContext = function () {
            var meta_names = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                meta_names[_i] = arguments[_i];
            }
            return function (constructor) {
                constructor.meta_names = meta_names;
            };
        };
        /**
         * 获取单个的meta
         * @param meta_class
         * @param id
         */
        FMeta.get_meta = function (meta_class, id) {
            var meta = new meta_class();
            var source = meta_class.get_meta_merge()[id];
            source ? meta.use_special(source) : meta.use_default(id);
            return meta;
        };
        /**
         * 获取meta数组
         * @param meta_class
         */
        FMeta.get_metas = function (meta_class) {
            return Object.keys(meta_class.get_meta_merge()).map(function (id) { return FMeta.get_meta(meta_class, id); });
        };
        /**
         * 获取所有meta的id数组
         * @param meta_class
         */
        FMeta.get_metas_ids = function (meta_class) {
            return Object.keys(meta_class.get_meta_merge());
        };
    })(exports.FMeta || (exports.FMeta = {}));

    (function (FNative) {
        var _this = this;
        /** 输出log */
        var TAG = "@FNative:";
        /** 入口封装类 */
        var GATE_CLASS = "JSBinding";
        /** 原生调用游戏的全局方法 */
        var NATIVE_CALLBACK = "NativeCallback";
        /** android平台的单独配置 */
        var ANDROID_CONFIG = {
            /** 类位置 */
            CLASS_PATH: "org/cocos2dx/javascript/",
            /** 方法签名 */
            FUNC_SIGNATURE: "(Ljava/lang/String;)Ljava/lang/String;"
        };
        /** 原生给的回调结果，由回调id和回调结果组成 */
        var native_callbacks = new Map();
        /** 判断为android平台 */
        FNative.is_android = function () { return cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID; };
        /** 判断为ios平台 */
        FNative.is_ios = function () { return cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS; };
        /** 判断为原生平台 */
        FNative.is_native = function () { return cc.sys.isNative; };
        /**
         * 调用原生
         * @param method 方法名
         * @param params 入参
         */
        FNative.call = function (method, params) {
            console.log(TAG, method, params);
            if (FNative.is_ios()) {
                return jsb.reflection.callStaticMethod(GATE_CLASS, method + ":", params);
            }
            else if (FNative.is_android()) {
                return jsb.reflection.callStaticMethod(ANDROID_CONFIG.CLASS_PATH + GATE_CLASS, method, ANDROID_CONFIG.FUNC_SIGNATURE, params);
            }
            else {
                // 非原生平台，返回null
                return null;
            }
        };
        /**
         * 异步调用
         * @param method 方法名
         * @param params 入参
         * @param wait_time 最大等待时间，默认为100s
         */
        FNative.call_async = function (method, params, wait_time) {
            if (wait_time === void 0) { wait_time = 100; }
            return __awaiter(_this, void 0, void 0, function () {
                var call_id, params_with_call_id, time, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            call_id = method + "/" + Date.now().toString(36) + "/" + Math.random().toFixed(5);
                            params_with_call_id = Object.assign(params, { call_id: call_id });
                            // 通知原生
                            FNative.call(method, JSON.stringify(params_with_call_id));
                            time = 0;
                            _a.label = 1;
                        case 1:
                            if (!(time < wait_time)) return [3 /*break*/, 5];
                            time += 0.1;
                            if (!native_callbacks.has(call_id)) return [3 /*break*/, 2];
                            result = native_callbacks.get(call_id);
                            native_callbacks.delete(call_id);
                            return [2 /*return*/, result];
                        case 2: return [4 /*yield*/, exports.FTool.wait_time(0.1)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 1];
                        case 5: 
                        // 超过时间轮训不到，则返回null
                        return [2 /*return*/, null];
                    }
                });
            });
        };
        /**
         * 原生调js的全局方法
         * @param call_id 调用id
         * @param call_result 调用结果
         */
        window[NATIVE_CALLBACK] = function (call_id, call_result) {
            console.log(TAG, NATIVE_CALLBACK, call_id, call_result);
            native_callbacks.set(call_id, call_result);
        };
    })(exports.FNative || (exports.FNative = {}));

    (function (FPanel) {
        var _this = this;
        /** 父节点 */
        var parent = null;
        /** 当前节点的zIndex */
        var now_z_index = 0;
        /** 界面脚本的实现基类 */
        var PanelBase = /** @class */ (function (_super) {
            __extends(PanelBase, _super);
            function PanelBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /** 界面的上下文信息 */
            PanelBase.context = null;
            return PanelBase;
        }(cc.Component));
        FPanel.PanelBase = PanelBase;
        /**
         * 设置 panel 类上下文的装饰器
         * @param config
         */
        FPanel.SetPanelContext = function (path, type, z_index_base) {
            if (type === void 0) { type = "old"; }
            if (z_index_base === void 0) { z_index_base = 0; }
            return function (constructor) {
                constructor.context = {
                    path: path,
                    z_index_base: z_index_base,
                    prefab: null,
                    ins: null,
                    type: type,
                    state: new exports.FState.SFSM({
                        id: "PanelState",
                        initial: "close",
                        states: {
                            "open": ["close"],
                            "close": ["open"],
                        },
                    }),
                };
            };
        };
        /**
         * 初始化系统，传入父节点
         * @param node
         */
        FPanel.init = function (node) {
            parent = node;
        };
        /**
         * 获取界面实例，如果获取不到，则创建新的
         * @param panel
         */
        var get_ins = function (panel) { return __awaiter(_this, void 0, void 0, function () {
            var _a, node;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!panel.context.prefab) return [3 /*break*/, 2];
                        _a = panel.context;
                        return [4 /*yield*/, exports.FTool.load_res(panel.context.path, cc.Prefab)];
                    case 1:
                        _a.prefab = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!!panel.context.ins) return [3 /*break*/, 4];
                        node = cc.instantiate(panel.context.prefab);
                        node.parent = parent;
                        node.position = cc.Vec3.ZERO;
                        node.width = cc.winSize.width;
                        node.height = cc.winSize.height;
                        panel.context.ins = node.getComponent(panel);
                        return [4 /*yield*/, panel.context.ins.on_create()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, panel.context.ins];
                }
            });
        }); };
        /**
         * 打开页面
         * @param panel
         * @param params
         */
        FPanel.open = function (panel) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var z_index, ins;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // 校验
                            if (!panel.context.state.try_go_state("open")) {
                                return [2 /*return*/];
                            }
                            z_index = now_z_index += 1;
                            return [4 /*yield*/, get_ins(panel)];
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
        };
        /**
         * 关闭页面
         * @param panel
         * @param params
         */
        FPanel.close = function (panel) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
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
                                panel.context.ins = null;
                            }
                            else if (panel.context.type === "old") {
                                panel.context.ins.node.active = false;
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
    })(exports.FPanel || (exports.FPanel = {}));

    (function (FText) {
        /** 输出log */
        var TAG = "@FText:";
        /** 事件：语言更改 */
        FText.EVENT_LANGUAGE_CHANGE = "@FText/language_change";
        /**
         * 需要在app中初始化
         * @param config_language 语言配置
         */
        FText.init = function (config_language) {
            data_runtime = config_language;
        };
        /**
         * 在编辑器中初始化
         * @param config_text
         */
        FText.init_editor = function (config_text) {
            CC_EDITOR && (data_editor = config_text);
        };
        /** 运行时配置 */
        var data_runtime;
        /** 编辑器配置 */
        var data_editor;
        /** 获取当前的语言key */
        FText.get_language = function () {
            return exports.FLocal.get("language");
        };
        /**
         * 修改当前语言
         * @param new_language
         */
        FText.change_language = function (new_language) {
            exports.FLocal.set("language", new_language);
            // 触发语言更改事件
            exports.FEvent.center.emit(FText.EVENT_LANGUAGE_CHANGE);
        };
        /**
         * 获取语言数据，如果获取失败，则返回key
         * @param key
         * @param params
         */
        FText.get_text = function (key) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            if (CC_EDITOR && !data_editor) {
                cc.error(TAG, "未在编辑器中初始化，请初始化");
                return key;
            }
            var text = CC_EDITOR
                ? data_editor[key]
                : data_runtime[FText.get_language()][key];
            if (text) {
                return exports.FTool.get_template_string.apply(exports.FTool, __spread([text], params));
            }
            else {
                cc.warn(TAG, "key\u4E0D\u5B58\u5728, key=" + key);
                return key;
            }
        };
    })(exports.FText || (exports.FText = {}));

    Object.defineProperty(exports, '__esModule', { value: true });

})));
