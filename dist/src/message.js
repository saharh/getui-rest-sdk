"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var util_1 = require("./util");
/**
 * 0:联网方式不限;1:仅wifi;2:仅4G/3G/2G
 */
var NetworkType;
(function (NetworkType) {
    NetworkType[NetworkType["ANY"] = 0] = "ANY";
    NetworkType[NetworkType["WIFI"] = 1] = "WIFI";
    NetworkType[NetworkType["CELLULAR"] = 2] = "CELLULAR";
})(NetworkType = exports.NetworkType || (exports.NetworkType = {}));
var Message = /** @class */ (function () {
    function Message() {
        /**
         * 是否离线发送
         */
        this.isOffline = true;
        /**
         * 离线过期时间
         */
        this.offlineExpireTime = 60 * 1000;
        /**
         * 网络类型
         */
        this.pushNetworkType = NetworkType.ANY;
    }
    Message.prototype.getData = function () {
        return util_1.removeUndefined({
            is_offline: this.isOffline,
            offline_expire_time: this.offlineExpireTime,
            push_network_type: this.pushNetworkType,
            msgtype: this.msgType,
        });
    };
    Object.defineProperty(Message.prototype, "template", {
        get: function () {
            return this._template;
        },
        set: function (template) {
            this._template = template;
            this.msgType = template.type;
        },
        enumerable: true,
        configurable: true
    });
    Message.prototype.getTemplateData = function () {
        return this._template && this._template.toObject();
    };
    Message.prototype.getPushInfo = function () {
        return this.apnsInfo && this.apnsInfo.toObject();
    };
    return Message;
}());
exports.Message = Message;
var SingleMessage = /** @class */ (function (_super) {
    __extends(SingleMessage, _super);
    function SingleMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SingleMessage;
}(Message));
exports.SingleMessage = SingleMessage;
var ListMessage = /** @class */ (function (_super) {
    __extends(ListMessage, _super);
    function ListMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ListMessage;
}(Message));
exports.ListMessage = ListMessage;
var Condition = /** @class */ (function () {
    function Condition(key, values, optType) {
        /**
         * 筛选参数
         */
        this.values = [];
        this.key = key;
        this.values = values;
        this.optType = optType;
    }
    Condition.prototype.toObject = function () {
        return util_1.removeUndefined({
            key: this.key,
            values: this.values,
            opt_type: this.optType,
        });
    };
    return Condition;
}());
exports.Condition = Condition;
var AppMessage = /** @class */ (function (_super) {
    __extends(AppMessage, _super);
    function AppMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppMessage.prototype.getConditions = function () {
        return _.map(this.conditions, function (c) { return c.toObject(); });
    };
    return AppMessage;
}(Message));
exports.AppMessage = AppMessage;
var TagMessage = /** @class */ (function (_super) {
    __extends(TagMessage, _super);
    function TagMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TagMessage;
}(Message));
exports.TagMessage = TagMessage;
//# sourceMappingURL=message.js.map