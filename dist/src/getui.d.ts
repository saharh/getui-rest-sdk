import { Alias } from './other';
import { Target, SingleMessage, AppMessage, ListMessage, TagMessage, TargetList, BatchTask, Condition } from './message';
export declare const GetuiError: any;
/**
 * 个推配置
 */
export interface GetuiOption {
    appId: string;
    appSecret: string;
    appKey: string;
    masterSecret: string;
}
/**
 * 个推所有的 rest 接口
 */
export declare class Getui {
    options: GetuiOption;
    private rp;
    private authToken;
    private authTokenAcquireTime;
    private waitQueue;
    private connecting;
    constructor(options: GetuiOption);
    private request;
    private startAuthSign;
    /**
     * 用户身份验证通过获得 auth_token 权限令牌，后面的请求都会自动带上 auth_token
     */
    authSign(): Promise<any>;
    /**
     * 将 auth_token 设为无效，以防止 auth_token 被其他人恶意使用
     */
    authClose(): Promise<any>;
    /**
     * 一个ClientID只能绑定一个别名，若已绑定过别名的ClientID再次绑定新别名，
     * 则认为与前一个别名自动解绑，绑定新别名
     * 允许将多个ClientID和一个别名绑定，如用户使用多终端，
     * 则可将多终端对应的ClientID绑定为一个别名，
     * 目前一个别名最多支持绑定10个ClientID
     *
     * @param {Alias} aliasList
     */
    bindAlias(aliasList: Alias[]): Promise<void>;
    /**
     * 通过传入的别名查询对应的cid信息
     * @param {string} alias
     */
    queryCid(alias: string): Promise<string[]>;
    /**
     * 通过传入的cid查询对应的别名
     * @param cid
     */
    queryAlias(cid: string): Promise<string>;
    /**
     * 单个cid和别名解绑
     * @param {string} cid
     * @param {string} alias
     */
    unbindAlias(cid: string, alias: string): Promise<void>;
    /**
     * 解绑别名所有cid
     * @param {string} alias
     */
    unbindAliasAll(alias: string): Promise<void>;
    /**
     * 对指定用户设置tag属性
     * @param {string} cid
     * @param {string[]} tags
     */
    setTags(cid: string, tags: string[]): Promise<void>;
    /**
     * 查询指定用户tag属性
     * @param {string} cid
     */
    getTags(cid: string): Promise<string[]>;
    /**
     * 黑名单用户管理
     * @param {string[]} cidList
     */
    addUserToBlackList(cidList: string[]): Promise<void>;
    /**
     * 移除黑名单用户
     * @param {string[]} cidList
     */
    removeUserFromBlackList(cidList: string[]): Promise<void>;
    /**
     * 查询用户状态
     * 调用此接口可获取用户状态，如在线不在线
     * @param {string} cid
     */
    getUserStatus(cid: string): Promise<any>;
    /**
     * 获取推送结果接口
     * 调用此接口查询推送数据，可查询消息有效可下发总数，消息回执总数和用户点击数等结果。
     * @param {string[]} taskIdList
     */
    getPushResult(taskIdList: string[]): Promise<any>;
    /**
     * 根据任务组名获取推送结果数据
     * 根据任务组名查询推送结果，返回结果包括百日内联网用户数（活跃用户数）、实际下发数、到达数、展示数、点击数。
     * @param {string} groupName
     */
    getPushResultByGroupName(groupName: any): Promise<any>;
    /**
     * 获取单日用户数据接口
     * 调用此接口查询推送数据，可查询消息有效可下发总数，消息回执总数和用户点击数等结果。
     * @param {string} date - 日期，格式为 YYYYMMDD
     */
    queryAppUser(date: string): Promise<any>;
    /**
     * 获取单日推送数据接口
     * 调用此接口可以获取某个应用单日的推送数据（推送数据包括：发送总数，在线发送数，接收数，展示数，点击数）
     * @param {string} date - 日期，格式为 YYYYMMDD
     */
    queryAppPush(date: string): Promise<any>;
    /**
     * 获取24小时在线用户数
     * 通过接口查询当前时间一天内的在线数（十分钟一个点，一小时六个点）
     */
    getLast24HoursOnlineUserStatistics(): Promise<any>;
    /**
     * 应用角标设置接口(仅iOS)
     * 设置iOS用户应用icon上显示的数字
     * @param {number} badge
     * @param {string[]} cidList
     * @param {deviceTokenList} deviceTokenList
     */
    setBadge(badge: number, cidList?: string[], deviceTokenList?: string[]): Promise<any>;
    /**
     * 按条件查询用户数
     * 通过指定查询条件来查询满足条件的用户数量
     *
     * @param {Condition[]} conditions
     * @returns {Promise<number>} User Count
     */
    queryUserCount(conditions: Condition[]): Promise<number>;
    /**
     * 获取回执的用户列表
     * 查询有回执的用户列表
     *
     * @param {string} taskId
     * @param {string[]} cids
     */
    getFeedbackUsers(taskId: string, cids: string[]): Promise<any>;
    /**
     * 获取可用bi标签
     * 查询应用可用的bi标签列表
     */
    queryBITags(): Promise<any>;
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
    pushMessageToSingle(message: SingleMessage, target: Target): Promise<any>;
    /**
     * 批量发送单推消息
     *
     * 应用场景
     *   1. 在给每个用户的推送内容都不同的情况下，又因为单推消息发送较慢，可以使用此接口。
     *
     * @param {BatchTask[]} batches
     */
    pushMessageToSingleBatch(batches: BatchTask[]): Promise<any>;
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
    pushMessageToApp(message: AppMessage, taskName?: string, speed?: number): Promise<any>;
    /**
     * 针对某个 appid 根据 tag 条件筛选，将消息群发给符合条件客户群
     *
     * @param {TagMessage} message
     * @param {number} [speed = 0]
     */
    pushMessageByTag(message: TagMessage, speed?: number): Promise<any>;
    saveListBody(message: ListMessage, taskName: any): Promise<any>;
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
    pushMessageToList(message: ListMessage, list: TargetList, taskName?: string): Promise<any>;
    /**
     * 在有效期内的消息进行停止
     * @param {string} taskId
     */
    stopTask(taskId: string): Promise<any>;
}
