"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var util_1 = require("./util");
var Alert = /** @class */ (function () {
    function Alert() {
    }
    Alert.prototype.toObject = function () {
        return util_1.removeUndefined({
            body: this.body,
            'action-loc-key': this.actionLocKey,
            'loc-key': this.locKey,
            'loc-args': this.locArgs,
            'launch-image': this.launchImage,
            title: this.title,
            'titile-loc-key': this.titileLocKey,
            'title-loc-args': this.titleLocArgs,
            subtitle: this.subtitle,
            'subtitle-loc-key': this.subtitleLocKey,
            'subtitle-loc-args': this.subtitleLocArgs,
        });
    };
    return Alert;
}());
exports.Alert = Alert;
/**
 *  资源类型
 *  1.图片，2.音频， 3.视频
 */
var MultimediaType;
(function (MultimediaType) {
    MultimediaType[MultimediaType["IMAGE"] = 1] = "IMAGE";
    MultimediaType[MultimediaType["AUDIO"] = 2] = "AUDIO";
    MultimediaType[MultimediaType["VIDEO"] = 3] = "VIDEO";
})(MultimediaType = exports.MultimediaType || (exports.MultimediaType = {}));
var Multimedia = /** @class */ (function () {
    function Multimedia() {
    }
    Multimedia.prototype.toObject = function () {
        return util_1.removeUndefined({
            url: this.url,
            type: this.type,
            only_wifi: this.onlyWifi,
        });
    };
    return Multimedia;
}());
exports.Multimedia = Multimedia;
/**
 * 具体参数含义详见苹果APNs文档：
 * https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html
 */
var ApnsInfo = /** @class */ (function () {
    function ApnsInfo() {
        /**
         * 用于计算icon上显示的数字，还可以实现显示数字的自动增减，如“+1”、 “-1”、 “1” 等，计算结果将覆盖badge
         */
        this.autoBadge = '+1';
        /**
         * 推送直接带有透传数据
         */
        this.contentAvailable = 1;
        /**
         * 该字段为 apn 推送的自定义数据，必须为 object
         */
        this.customMsg = {};
    }
    ApnsInfo.prototype.toObject = function () {
        var pushInfo = {
            aps: util_1.removeUndefined({
                alert: this.alert.toObject(),
                autoBadge: this.autoBadge,
                sound: this.sound,
                'content-available': this.contentAvailable,
                category: this.category,
            }),
            multimedia: _.map(this.multimedias, function (m) { return m.toObject(); }),
        };
        return _.assign({}, this.customMsg, pushInfo);
    };
    return ApnsInfo;
}());
exports.ApnsInfo = ApnsInfo;
//# sourceMappingURL=apnsInfo.js.map