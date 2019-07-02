import { GetuiOption } from './getui';
/**
 * 个推所有的 rest 接口
 */
export declare class GetuiGy {
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
    verifyQuery(gyuId: string, reqId: string): Promise<any>;
}
