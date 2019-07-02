"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var crypto = require("crypto");
var os = require("os");
var _ = require("lodash");
var uuid = require("uuid");
function sha256(content) {
    return crypto.createHash('sha256').update(content).digest('hex').toString();
}
exports.sha256 = sha256;
function getRequestId() {
    return uuid.v1().replace(/-/g, '').slice(0, 30);
}
exports.getRequestId = getRequestId;
function removeUndefined(obj) {
    return _.pickBy(obj, function (v) { return !_.isUndefined(v); });
}
exports.removeUndefined = removeUndefined;
function getUserAgent() {
    var pkgFile = path_1.resolve(__dirname, '../../package.json');
    var pkg = JSON.parse(fs_1.readFileSync(pkgFile).toString());
    return pkg.name + "/" + pkg.version + " (" + os.type() + "; " + os.release() + ") node/" + process.version;
}
exports.getUserAgent = getUserAgent;
//# sourceMappingURL=util.js.map