import { BaseTemplate } from './template';
import { ApnsInfo } from './apnsInfo';
import { Region, PhoneType, ConditionKey, CondOptType } from './other';
/**
 * 0:联网方式不限;1:仅wifi;2:仅4G/3G/2G
 */
export declare enum NetworkType {
    ANY = 0,
    WIFI = 1,
    CELLULAR = 2
}
export interface Target {
    cid?: string;
    alias?: string;
}
export interface TargetList {
    /**
     * cid为cid list，与alias list二选一
     */
    cid?: string[];
    /**
     * alias为alias list，与cid list二选一
     */
    alias?: string[];
}
export declare class Message {
    /**
     * 是否离线发送
     */
    isOffline: boolean;
    /**
     * 离线过期时间
     */
    offlineExpireTime: number;
    /**
     * 网络类型
     */
    pushNetworkType: NetworkType;
    msgType: string;
    _template: BaseTemplate;
    apnsInfo?: ApnsInfo;
    getData(): any;
    template: BaseTemplate;
    getTemplateData(): any;
    getPushInfo(): any;
}
export declare class SingleMessage extends Message {
}
export interface BatchTask {
    message: SingleMessage;
    target: Target;
}
export declare class ListMessage extends Message {
}
export declare class Condition {
    /**
     * 筛选条件类型名称(省市region,手机类型phonetype,用户标签tag)
     */
    key: ConditionKey;
    /**
     * 筛选参数
     */
    values: (Region | PhoneType | string)[];
    /**
     * 筛选参数的组合，0:取参数并集or，1：交集and，2：相当与not in {参数1，参数2，....}
     */
    optType: CondOptType;
    constructor(key: any, values: any, optType: any);
    toObject(): any;
}
export declare class AppMessage extends Message {
    conditions: Condition[];
    getConditions(): any;
}
export declare class TagMessage extends Message {
    /**
     * 用户的 tag
     */
    tag: string;
}
