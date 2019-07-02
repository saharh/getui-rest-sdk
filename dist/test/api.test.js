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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var nock_1 = require("./fixtures/nock");
var src_1 = require("../src");
var option = {
    appId: process.env.GETUI_APP_ID || 'test_app_id',
    appSecret: process.env.GETUI_APP_SECRET || 'test_app_secret',
    appKey: process.env.GETUI_APP_KEY || 'test_app_key',
    masterSecret: process.env.GETUI_MASTER_SECRET || 'test_master_secret',
};
var gt;
var testTag = process.env.GETUI_TEST_TAG || 'test-tag';
var testCID = process.env.GETUI_CID || 'test-cid';
if (!process.env.GETUI_TEST_USE_REAL_CONNECTION) {
    nock_1.default(option.appId);
}
ava_1.default.before(function (t) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        gt = new src_1.default(option);
        return [2 /*return*/];
    });
}); });
ava_1.default.after.always(function (t) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, gt.authClose()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function getApnsInfoAndTemplate(type) {
    var alert = new src_1.Alert();
    alert.title = 'Title: push test';
    alert.body = "Body: " + type + " push test";
    var payload = JSON.stringify({
        message: "Payload message: " + type + " push message test",
    });
    var apnsInfo = new src_1.ApnsInfo();
    apnsInfo.alert = alert;
    apnsInfo.customMsg = { payload: payload };
    var template = new src_1.TransmissionTemplate();
    template.transmissionContent = payload;
    return {
        apnsInfo: apnsInfo,
        template: template,
    };
}
ava_1.default('#test single', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, apnsInfo, template, message, target, ret;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getApnsInfoAndTemplate('single'), apnsInfo = _a.apnsInfo, template = _a.template;
                message = new src_1.SingleMessage();
                message.template = template;
                message.apnsInfo = apnsInfo;
                target = {
                    cid: testCID,
                };
                return [4 /*yield*/, gt.pushMessageToSingle(message, target)];
            case 1:
                ret = _b.sent();
                t.is(ret.result, 'ok');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('#test app', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, apnsInfo, template, cond, message, ret;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getApnsInfoAndTemplate('app'), apnsInfo = _a.apnsInfo, template = _a.template;
                cond = new src_1.Condition(src_1.ConditionKey.TAG, [testTag], src_1.CondOptType.OR);
                message = new src_1.AppMessage();
                message.template = template;
                message.apnsInfo = apnsInfo;
                message.conditions = [cond];
                return [4 /*yield*/, gt.pushMessageToApp(message)];
            case 1:
                ret = _b.sent();
                t.is(ret.result, 'ok');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('#test tag', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, apnsInfo, template, message, ret;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getApnsInfoAndTemplate('tag'), apnsInfo = _a.apnsInfo, template = _a.template;
                message = new src_1.TagMessage();
                message.template = template;
                message.apnsInfo = apnsInfo;
                message.tag = testTag;
                return [4 /*yield*/, gt.pushMessageByTag(message)];
            case 1:
                ret = _b.sent();
                t.is(ret.result, 'ok');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('#test list', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, apnsInfo, template, message, target, ret;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getApnsInfoAndTemplate('list'), apnsInfo = _a.apnsInfo, template = _a.template;
                message = new src_1.ListMessage();
                message.template = template;
                message.apnsInfo = apnsInfo;
                target = {
                    cid: [process.env.GETUI_CID],
                };
                return [4 /*yield*/, gt.pushMessageToList(message, target)];
            case 1:
                ret = _b.sent();
                t.is(ret.result, 'ok');
                return [2 /*return*/];
        }
    });
}); });
ava_1.default('#test single batch', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var _a, apnsInfo, template, message, target, bsmsg, ret;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getApnsInfoAndTemplate('single batch'), apnsInfo = _a.apnsInfo, template = _a.template;
                message = new src_1.SingleMessage();
                message.template = template;
                message.apnsInfo = apnsInfo;
                target = {
                    cid: testCID,
                };
                bsmsg = {
                    message: message,
                    target: target,
                };
                return [4 /*yield*/, gt.pushMessageToSingleBatch([bsmsg])];
            case 1:
                ret = _b.sent();
                t.is(ret.result, 'ok');
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=api.test.js.map