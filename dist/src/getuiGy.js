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
var debug = require("debug");
// rp.debug = true;
var util_1 = require("./util");
var log = debug('getui');
var USER_AGENT = util_1.getUserAgent();
log("using user agent " + USER_AGENT);
var GETUI_BASE_URL = 'https://openapi-gy.getui.com/v1';
log("using getuiGy base url " + GETUI_BASE_URL);
var getui_1 = require("./getui");
/**
 * 个推所有的 rest 接口
 */
var GetuiGy = /** @class */ (function () {
    function GetuiGy(options) {
        this.waitQueue = [];
        this.connecting = false;
        this.options = options;
        this.rp = rp.defaults({
            baseUrl: "" + GETUI_BASE_URL,
            method: 'POST',
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': '*/*',
            },
            json: true,
        });
    }
    GetuiGy.prototype.request = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var ignoreUrls, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (params.body) {
                            params.body = util_1.removeUndefined(params.body);
                        }
                        ignoreUrls = [
                            '/gy/auth_sign',
                            '/gy/auth_close',
                        ];
                        if (!!_.includes(ignoreUrls, params.url)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.authSign()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.authToken) {
                            if (params.body) {
                                _.assign(params.body, {
                                    authToken: this.authToken
                                });
                            }
                        }
                        log(JSON.stringify(params.body, null, 2));
                        return [4 /*yield*/, this.rp(params)];
                    case 3:
                        ret = _a.sent();
                        if (ret == null || ret.data == null || ret.data.result !== '20000')
                            throw new getui_1.GetuiError(ret && ret.data && ret.data.result, { detail: ret });
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    GetuiGy.prototype.startAuthSign = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, sign, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = _.now();
                        sign = util_1.sha256("" + this.options.appKey + timestamp + this.options.masterSecret);
                        return [4 /*yield*/, this.request({
                                url: "/gy/auth_sign",
                                method: 'POST',
                                body: {
                                    sign: sign,
                                    timestamp: timestamp,
                                    appId: this.options.appId,
                                },
                                json: true
                            })];
                    case 1:
                        result = _a.sent();
                        if (!result || !result.data || !result.data.data || !result.data.data.authToken) {
                            throw new Error('authToken not found in getAuthToken response!');
                        }
                        this.authToken = result.data.data.authToken;
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
    GetuiGy.prototype.authSign = function () {
        return __awaiter(this, void 0, void 0, function () {
            var elapse, e_1, resolve;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elapse = _.now() - this.authTokenAcquireTime;
                        // 检验 token 是否超过了有效时间，官方说明为一天，考虑到网络延时，提前 10 分钟
                        if (this.authToken && elapse < 8580000)
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
    // /**
    //  * 将 auth_token 设为无效，以防止 auth_token 被其他人恶意使用
    //  */
    // public async authClose(): Promise<any> {
    //   await this.request({
    //     url: `/auth_close`,
    //     body: {},
    //   });
    //
    //   this.authToken = null;
    // }
    GetuiGy.prototype.verifyQuery = function (gyuId, reqId) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                body = {
                    appId: this.options.appId,
                    gyuid: gyuId,
                    reqId: reqId,
                };
                return [2 /*return*/, this.request({
                        url: '/gy/verify_query',
                        body: body,
                    })];
            });
        });
    };
    return GetuiGy;
}());
exports.GetuiGy = GetuiGy;
//# sourceMappingURL=getuiGy.js.map