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
var BaseTemplate = /** @class */ (function () {
    function BaseTemplate() {
    }
    BaseTemplate.prototype.toObject = function () {
        return util_1.removeUndefined({
            duration_begin: this.durationBegin,
            duration_end: this.durationEnd,
        });
    };
    return BaseTemplate;
}());
exports.BaseTemplate = BaseTemplate;
/**
 * 在通知栏显示一条含图标、标题等的通知，用户点击后，会激活您的应用
 */
var NotificationTemplate = /** @class */ (function (_super) {
    __extends(NotificationTemplate, _super);
    function NotificationTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'notification';
        /**
         * 收到消息是否立即启动应用，true 为立即启动，false 则广播等待启动，默认是否
         */
        _this.transmissionType = false;
        return _this;
    }
    NotificationTemplate.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            transmission_type: this.transmissionType,
            transmission_content: this.transmissionContent,
            style: this.style && this.style.toObject(),
        }));
    };
    return NotificationTemplate;
}(BaseTemplate));
exports.NotificationTemplate = NotificationTemplate;
/**
 * 当使用link作为推送模板时，当客户收到通知时，
 * 在通知栏会下是一条含图标、标题等的通知，
 * 用户点击时，可以打开您指定的网页
 */
var LinkTemplate = /** @class */ (function (_super) {
    __extends(LinkTemplate, _super);
    function LinkTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'link';
        return _this;
    }
    LinkTemplate.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            url: this.url,
            style: this.style && this.style.toObject(),
        }));
    };
    return LinkTemplate;
}(BaseTemplate));
exports.LinkTemplate = LinkTemplate;
/**
 * 当使用该模板进行消息通知时，在通知栏会显示一条包含图标、标题等的通知。
 * 用户点击弹框内容是，可以选择直接下载应用，或者取消下载应用。
 */
var NotypoploadTemplate = /** @class */ (function (_super) {
    __extends(NotypoploadTemplate, _super);
    function NotypoploadTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'notypopload';
        return _this;
    }
    NotypoploadTemplate.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            notyicon: this.notyIcon,
            notytitle: this.notyTitle,
            notycontent: this.notyContent,
            poptitle: this.popTitle,
            popcontent: this.popContent,
            popimage: this.popImage,
            popbutton1: this.popButton1,
            popbutton2: this.popButton2,
            loadicon: this.loadIcon,
            loadtitle: this.loadTitle,
            loadurl: this.loadUrl,
            is_autoinstall: this.isAutoInstall,
            is_actived: this.isActived,
            androidmark: this.androidMark,
            symbianmark: this.symbianMark,
            iphonemark: this.iphoneMark,
        }));
    };
    return NotypoploadTemplate;
}(BaseTemplate));
exports.NotypoploadTemplate = NotypoploadTemplate;
/**
 * 透传消息是指消息传递到客户端只有消息内容，展现的形式由客户端自行定义。
 * 客户端可自定义通知的展现形式，可以自定义通知到达后的动作，
 * 或者不做任何展现。IOS推送也使用该模板
 */
var TransmissionTemplate = /** @class */ (function (_super) {
    __extends(TransmissionTemplate, _super);
    function TransmissionTemplate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'transmission';
        /**
         * 收到消息是否立即启动应用，true 为立即启动，false 则广播等待启动，默认是否
         */
        _this.transmissionType = false;
        return _this;
    }
    TransmissionTemplate.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            transmission_type: this.transmissionType,
            transmission_content: this.transmissionContent,
            notify: this.notify
        }));
    };
    return TransmissionTemplate;
}(BaseTemplate));
exports.TransmissionTemplate = TransmissionTemplate;
var Notify = /** @class */ (function (_super) {
    __extends(Notify, _super);
    function Notify() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Notify;
}(TransmissionTemplate));
exports.Notify = Notify;
//# sourceMappingURL=template.js.map