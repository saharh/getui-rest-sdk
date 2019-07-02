"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var rp = require("request-promise");
var createError = require("create-error");
var debug = require("debug");
var util_1 = require("./util");
var log = debug('getui');
exports.GetuiError = createError('GetuiError', {
    code: 'GETUI_ERROR',
});
var USER_AGENT = util_1.getUserAgent();
log("using user agent " + USER_AGENT);
var GETUI_BASE_URL = 'https://restapi.getui.com/v1';
log("using getui base url " + GETUI_BASE_URL);
/**
 * 个推所有的 rest 接口
 */
var Getui = /** @class */ (function () {
    function Getui(options) {
        this.waitQueue = [];
        this.connecting = false;
        this.options = options;
        this.rp = rp.defaults({
            baseUrl: GETUI_BASE_URL + "/" + this.options.appId,
            method: 'POST',
            headers: {
                'User-Agent': USER_AGENT,
            },
            json: true,
        });
    }
    Getui.prototype.request = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var ingoreUrls, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (params.body) {
                            params.body = util_1.removeUndefined(params.body);
                        }
                        ingoreUrls = [
                            '/auth_sign',
                            '/auth_close',
                        ];
                        if (!!_.includes(ingoreUrls, params.url)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authSign()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.authToken) {
                            params.headers = {
                                'User-Agent': USER_AGENT,
                                authtoken: this.authToken,
                            };
                        }
                        log(JSON.stringify(params.body, null, 2));
                        return [4 /*yield*/, this.rp(params)];
                    case 3:
                        ret = _a.sent();
                        if (ret.result !== 'ok')
                            throw new exports.GetuiError(ret.result, { detail: ret });
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    Getui.prototype.startAuthSign = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, sign, authToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = _.now();
                        sign = util_1.sha256("" + this.options.appKey + timestamp + this.options.masterSecret);
                        return [4 /*yield*/, this.request({
                                url: "/auth_sign",
                                body: {
                                    sign: sign,
                                    timestamp: timestamp,
                                    appkey: this.options.appKey,
                                },
                            })];
                    case 1:
                        authToken = (_a.sent()).auth_token;
                        this.authToken = authToken;
                        this.authTokenAcquireTime = _.now();
                        log("authToken: " + this.authToken + ", authTokenAcquireTime: " + this.authTokenAcquireTime);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 用户身份验证通过获得 auth_token 权限令牌，后面的请求都会自动带上 auth_token
     */
    Getui.prototype.authSign = function () {
        return __awaiter(this, void 0, void 0, function () {
            var elaspe, e_1, resolve;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elaspe = _.now() - this.authTokenAcquireTime;
                        // 检验 token 是否超过了有效时间，官方说明为一天，考虑到网络延时，提前 10 分钟
                        if (this.authToken && elaspe < 8580000)
                            return [2 /*return*/];
                        if (this.connecting) {
                            return [2 /*return*/, new Promise(function (resolve) {
                                    _this.waitQueue.push(resolve);
                                })];
                        }
                        this.connecting = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.startAuthSign()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.connecting = false;
                        throw e_1;
                    case 4:
                        this.connecting = false;
                        log("wait queue lenght: " + this.waitQueue.length);
                        while (this.waitQueue.length) {
                            resolve = this.waitQueue.pop();
                            resolve();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 将 auth_token 设为无效，以防止 auth_token 被其他人恶意使用
     */
    Getui.prototype.authClose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/auth_close",
                            body: {},
                        })];
                    case 1:
                        _a.sent();
                        this.authToken = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 一个ClientID只能绑定一个别名，若已绑定过别名的ClientID再次绑定新别名，
     * 则认为与前一个别名自动解绑，绑定新别名
     * 允许将多个ClientID和一个别名绑定，如用户使用多终端，
     * 则可将多终端对应的ClientID绑定为一个别名，
     * 目前一个别名最多支持绑定10个ClientID
     *
     * @param {Alias} aliasList
     */
    Getui.prototype.bindAlias = function (aliasList) {
        var list = _.map(aliasList, function (alias) {
            return {
                cid: alias.cid,
                alias: alias.alias,
            };
        });
        return this.request({
            url: "/bind_alias",
            body: {
                alias_list: list,
            },
        });
    };
    /**
     * 通过传入的别名查询对应的cid信息
     * @param {string} alias
     */
    Getui.prototype.queryCid = function (alias) {
        return __awaiter(this, void 0, void 0, function () {
            var cid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/query_cid/" + alias,
                        })];
                    case 1:
                        cid = (_a.sent()).cid;
                        return [2 /*return*/, cid];
                }
            });
        });
    };
    /**
     * 通过传入的cid查询对应的别名
     * @param cid
     */
    Getui.prototype.queryAlias = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var alias;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/query_alias/" + cid,
                        })];
                    case 1:
                        alias = (_a.sent()).alias;
                        return [2 /*return*/, alias];
                }
            });
        });
    };
    /**
     * 单个cid和别名解绑
     * @param {string} cid
     * @param {string} alias
     */
    Getui.prototype.unbindAlias = function (cid, alias) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/unbind_alias",
                            body: {
                                cid: cid,
                                alias: alias,
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 解绑别名所有cid
     * @param {string} alias
     */
    Getui.prototype.unbindAliasAll = function (alias) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/unbind_alias_all",
                            body: {
                                alias: alias,
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 对指定用户设置tag属性
     * @param {string} cid
     * @param {string[]} tags
     */
    Getui.prototype.setTags = function (cid, tags) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/set_tags",
                            body: {
                                cid: cid,
                                tag_list: tags,
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 查询指定用户tag属性
     * @param {string} cid
     */
    Getui.prototype.getTags = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var tags;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/get_tags/" + cid,
                        })];
                    case 1:
                        tags = (_a.sent()).tags;
                        return [2 /*return*/, tags];
                }
            });
        });
    };
    /**
     * 黑名单用户管理
     * @param {string[]} cidList
     */
    Getui.prototype.addUserToBlackList = function (cidList) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/user_blk_list",
                            body: {
                                cid: cidList,
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 移除黑名单用户
     * @param {string[]} cidList
     */
    Getui.prototype.removeUserFromBlackList = function (cidList) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'DELETE',
                            url: "/user_blk_list",
                            body: {
                                cid: cidList,
                            },
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 查询用户状态
     * 调用此接口可获取用户状态，如在线不在线
     * @param {string} cid
     */
    Getui.prototype.getUserStatus = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/user_status/" + cid,
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 获取推送结果接口
     * 调用此接口查询推送数据，可查询消息有效可下发总数，消息回执总数和用户点击数等结果。
     * @param {string[]} taskIdList
     */
    Getui.prototype.getPushResult = function (taskIdList) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/push_result",
                            body: {
                                taskIdList: taskIdList,
                            },
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 根据任务组名获取推送结果数据
     * 根据任务组名查询推送结果，返回结果包括百日内联网用户数（活跃用户数）、实际下发数、到达数、展示数、点击数。
     * @param {string} groupName
     */
    Getui.prototype.getPushResultByGroupName = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/get_push_result_by_group_name/" + groupName,
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 获取单日用户数据接口
     * 调用此接口查询推送数据，可查询消息有效可下发总数，消息回执总数和用户点击数等结果。
     * @param {string} date - 日期，格式为 YYYYMMDD
     */
    Getui.prototype.queryAppUser = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/query_app_user/" + date,
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 获取单日推送数据接口
     * 调用此接口可以获取某个应用单日的推送数据（推送数据包括：发送总数，在线发送数，接收数，展示数，点击数）
     * @param {string} date - 日期，格式为 YYYYMMDD
     */
    Getui.prototype.queryAppPush = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/query_app_push/" + date,
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 获取24小时在线用户数
     * 通过接口查询当前时间一天内的在线数（十分钟一个点，一小时六个点）
     */
    Getui.prototype.getLast24HoursOnlineUserStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/get_last_24hours_online_User_statistics",
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 应用角标设置接口(仅iOS)
     * 设置iOS用户应用icon上显示的数字
     * @param {number} badge
     * @param {string[]} cidList
     * @param {deviceTokenList} deviceTokenList
     */
    Getui.prototype.setBadge = function (badge, cidList, deviceTokenList) {
        if (cidList === void 0) { cidList = []; }
        if (deviceTokenList === void 0) { deviceTokenList = []; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/set_badge",
                            body: {
                                badge: badge,
                                cid_list: cidList,
                                devicetoken_list: deviceTokenList,
                            },
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 按条件查询用户数
     * 通过指定查询条件来查询满足条件的用户数量
     *
     * @param {Condition[]} conditions
     * @returns {Promise<number>} User Count
     */
    Getui.prototype.queryUserCount = function (conditions) {
        return __awaiter(this, void 0, void 0, function () {
            var userCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/query_user_count",
                            body: {
                                condition: _.map(conditions, function (cond) { return cond.toObject(); }),
                            },
                        })];
                    case 1:
                        userCount = (_a.sent()).user_count;
                        return [2 /*return*/, userCount];
                }
            });
        });
    };
    /**
     * 获取回执的用户列表
     * 查询有回执的用户列表
     *
     * @param {string} taskId
     * @param {string[]} cids
     */
    Getui.prototype.getFeedbackUsers = function (taskId, cids) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            url: "/get_feedback_users",
                            body: {
                                data: {
                                    taskId: taskId,
                                    cids: cids,
                                }
                            },
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 获取可用bi标签
     * 查询应用可用的bi标签列表
     */
    Getui.prototype.queryBITags = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request({
                            method: 'GET',
                            url: "/query_bi_tags",
                        })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * 对使用App的某个用户，单独推送消息
     *
     * 应用场景
     *   场景1：某用户发生了一笔交易，银行及时下发一条推送消息给该用户。
     *   场景2：用户定制了某本书的预订更新，当本书有更新时，
     *         需要向该用户及时下发一条更新提醒信息。
     *
     *  这些需要向指定某个用户推送消息的场景，即需要使用对单个用户推送消息的接口。
     *
     * @param {SingleMessage} message
     * @param {Target} target
     */
    Getui.prototype.pushMessageToSingle = function (message, target) {
        var _a;
        var body = util_1.removeUndefined((_a = {
                message: message.getData()
            },
            _a[message.msgType] = message.getTemplateData(),
            _a.cid = target.cid,
            _a.alias = target.alias,
            _a.push_info = message.getPushInfo(),
            _a.requestid = util_1.getRequestId(),
            _a));
        body.message.appkey = this.options.appKey;
        return this.request({
            url: '/push_single',
            body: body,
        });
    };
    /**
     * 批量发送单推消息
     *
     * 应用场景
     *   1. 在给每个用户的推送内容都不同的情况下，又因为单推消息发送较慢，可以使用此接口。
     *
     * @param {BatchTask[]} batches
     */
    Getui.prototype.pushMessageToSingleBatch = function (batches) {
        var _this = this;
        var list = _.map(batches, function (batch) {
            var _a;
            var message = batch.message;
            var target = batch.target;
            var data = (_a = {
                    message: message.getData()
                },
                _a[message.msgType] = message.getTemplateData(),
                _a.cid = target.cid,
                _a.alias = target.alias,
                _a.push_info = message.getPushInfo(),
                _a.requestid = util_1.getRequestId(),
                _a);
            data.message.appkey = _this.options.appKey;
            return data;
        });
        return this.request({
            url: '/push_single_batch',
            body: {
                msg_list: list,
                need_detail: true,
            },
        });
    };
    /**
     * 对单个或多个指定应用的所有用户群发推送消息。
     *
     * 应用场景
     *   场景1，某app周年庆，群发消息给该app的所有用户，提醒用户参加周年庆活动。
     *
     * @param {AppMessage} message
     * @param {string} [taskName = undefined]
     * @param {number} [speed = 0]
     */
    Getui.prototype.pushMessageToApp = function (message, taskName, speed) {
        if (taskName === void 0) { taskName = void 0; }
        if (speed === void 0) { speed = 0; }
        var _a;
        var body = util_1.removeUndefined((_a = {
                message: message.getData()
            },
            _a[message.msgType] = message.getTemplateData(),
            _a.condition = message.getConditions(),
            _a.push_info = message.getPushInfo(),
            _a.requestid = util_1.getRequestId(),
            _a.speed = speed,
            _a.task_name = taskName,
            _a));
        body.message.appkey = this.options.appKey;
        return this.request({
            url: '/push_app',
            body: body,
        });
    };
    /**
     * 针对某个 appid 根据 tag 条件筛选，将消息群发给符合条件客户群
     *
     * @param {TagMessage} message
     * @param {number} [speed = 0]
     */
    Getui.prototype.pushMessageByTag = function (message, speed) {
        if (speed === void 0) { speed = 0; }
        var _a;
        var body = util_1.removeUndefined((_a = {
                message: message.getData(),
                tag: message.tag
            },
            _a[message.msgType] = message.getTemplateData(),
            _a.push_info = message.getPushInfo(),
            _a.requestid = util_1.getRequestId(),
            _a.speed = speed,
            _a));
        body.message.appkey = this.options.appKey;
        return this.request({
            url: '/push_by_tag',
            body: body,
        });
    };
    Getui.prototype.saveListBody = function (message, taskName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body;
            return __generator(this, function (_b) {
                body = (_a = {
                        message: message.getData()
                    },
                    _a[message.msgType] = message.getTemplateData(),
                    _a.push_info = message.getPushInfo(),
                    _a.task_name = taskName,
                    _a);
                body.message.appkey = this.options.appKey;
                return [2 /*return*/, this.request({
                        url: '/save_list_body',
                        body: body,
                    })];
            });
        });
    };
    /**
     * 上传clientid或别名列表，对列表中所有clientid或别名用户进行消息推送，
     * 如果仅对单个用户推送务必使用单推接口，
     * 否则会严重影响推送性能，如果对少量甚至几个用户推送同样的消息，
     * 建议使用单推实现，性能会更高
     *
     * 应用场景
     *   场景1：对于抽奖活动的应用，需要对已知的某些用户推送中奖消息，
     *         就可以通过clientid列表方式推送消息。
     *   场景2：向新客用户发放抵用券，提升新客的转化率，就可以事先提取新客列表，
     *         将消息指定发送给这部分指定clientid用户
     *
     * @param {ListMessage} message
     * @param {TargetList} list
     * @param {string} [taskName = undefined]
     */
    Getui.prototype.pushMessageToList = function (message, list, taskName) {
        if (taskName === void 0) { taskName = void 0; }
        return __awaiter(this, void 0, void 0, function () {
            var taskid, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveListBody(message, taskName)];
                    case 1:
                        taskid = (_a.sent()).taskid;
                        body = {
                            taskid: taskid,
                            cid: list.cid,
                            alias: list.alias,
                            need_detail: true,
                        };
                        return [2 /*return*/, this.request({
                                url: '/push_list',
                                body: body,
                            })];
                }
            });
        });
    };
    /**
     * 在有效期内的消息进行停止
     * @param {string} taskId
     */
    Getui.prototype.stopTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'DELETE',
                        url: "/stop_task/" + taskId,
                    })];
            });
        });
    };
    return Getui;
}());
exports.Getui = Getui;
//# sourceMappingURL=getui.js.map