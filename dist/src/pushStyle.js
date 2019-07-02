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
var Style = /** @class */ (function () {
    function Style() {
        /**
         * 收到通知是否响铃：true响铃，false不响铃。默认响铃
         */
        this.isRing = true;
        /**
         * 收到通知是否振动：true振动，false不振动。默认振动
         */
        this.isVibrate = true;
        /**
         * 通知是否可清除： true可清除，false不可清除。默认可清除
         */
        this.isClearable = true;
    }
    Style.prototype.toObject = function () {
        return util_1.removeUndefined({
            is_ring: this.isRing,
            is_vibrate: this.isVibrate,
            is_clearable: this.isClearable,
            logo: this.logo,
        });
    };
    return Style;
}());
exports.Style = Style;
/**
 * 系统样式
 */
var SystemStyle = /** @class */ (function (_super) {
    __extends(SystemStyle, _super);
    function SystemStyle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 0;
        return _this;
    }
    SystemStyle.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            type: this.type,
            text: this.text,
            title: this.title,
        }));
    };
    return SystemStyle;
}(Style));
exports.SystemStyle = SystemStyle;
/**
 * 个推样式
 */
var GetuiStyle = /** @class */ (function (_super) {
    __extends(GetuiStyle, _super);
    function GetuiStyle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 1;
        return _this;
    }
    GetuiStyle.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            type: this.type,
            text: this.text,
            title: this.title,
            logourl: this.logoUrl,
        }));
    };
    return GetuiStyle;
}(Style));
exports.GetuiStyle = GetuiStyle;
/**
 * 纯图样式(背景图样式)
 */
var ImageStyle = /** @class */ (function (_super) {
    __extends(ImageStyle, _super);
    function ImageStyle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 4;
        return _this;
    }
    ImageStyle.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            type: this.type,
            banner_url: this.bannerUrl,
        }));
    };
    return ImageStyle;
}(Style));
exports.ImageStyle = ImageStyle;
/**
 * 展开通知样式
 */
var ExpandStyle = /** @class */ (function (_super) {
    __extends(ExpandStyle, _super);
    function ExpandStyle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 6;
        return _this;
    }
    ExpandStyle.prototype.toObject = function () {
        return util_1.removeUndefined(_.assign(_super.prototype.toObject.call(this), {
            type: this.type,
            text: this.text,
            title: this.title,
            logourl: this.logoUrl,
            big_style: this.bigStyle,
            big_image_url: this.bigImageUrl,
            big_text: this.bigText,
            banner_url: this.bannerUrl,
        }));
    };
    return ExpandStyle;
}(Style));
exports.ExpandStyle = ExpandStyle;
//# sourceMappingURL=pushStyle.js.map