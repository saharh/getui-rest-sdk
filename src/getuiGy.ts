import {setTimeout} from 'timers';

import * as _ from 'lodash';
import * as rp from 'request-promise';
import * as createError from 'create-error';
import * as debug from 'debug';

import {
  sha256,
  getRequestId,
  removeUndefined,
  getUserAgent
} from './util';

const log = debug('getui');

// export const GetuiError = createError('GetuiError', {
//   code: 'GETUI_ERROR',
// });

const USER_AGENT = getUserAgent();
log(`using user agent ${USER_AGENT}`);

const GETUI_BASE_URL: string = 'https://openapi-gy.getui.com/v1';
log(`using getuiGy base url ${GETUI_BASE_URL}`);


import {GetuiOption, GetuiError} from './getui';

/**
 * 个推所有的 rest 接口
 */
export class GetuiGy {
  public options: GetuiOption;
  private rp: any;
  private authToken: string;
  private authTokenAcquireTime: number;
  private waitQueue: any[] = [];
  private connecting: boolean = false;

  public constructor(options: GetuiOption) {
    this.options = options;

    this.rp = rp.defaults({
      baseUrl: `${GETUI_BASE_URL}`,
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
      },
      json: true,
    });
  }

  private async request(params: any): Promise<any> {
    if (params.body) {
      params.body = removeUndefined(params.body);
    }

    const ignoreUrls = [
      '/auth_sign',
      '/auth_close',
    ];
    if (!_.includes(ignoreUrls, params.url)) {
      await this.authSign();
    }

    if (this.authToken) {
      if (params.body) {
        _.assign(params.body, {
          authToken: this.authToken
        });
      }
    }

    log(JSON.stringify(params.body, null, 2));
    const ret = await this.rp(params);

    if (ret.result !== 'ok') throw new GetuiError(ret.result, {detail: ret});
    return ret;
  }

  private async startAuthSign(): Promise<void> {
    const timestamp = _.now();
    const sign = sha256(`${this.options.appKey}${timestamp}${this.options.masterSecret}`);
    const {authToken} = await this.request({
      url: `/gy/auth_sign`,
      body: {
        sign,
        timestamp,
        appId: this.options.appId,
      },
    });
    this.authToken = authToken;
    this.authTokenAcquireTime = _.now();
    log(`authToken: ${this.authToken}, authTokenAcquireTime: ${this.authTokenAcquireTime}`);
  }

  /**
   * 用户身份验证通过获得 auth_token 权限令牌，后面的请求都会自动带上 auth_token
   */
  public async authSign(): Promise<any> {
    const elapse = _.now() - this.authTokenAcquireTime;
    // 检验 token 是否超过了有效时间，官方说明为一天，考虑到网络延时，提前 10 分钟
    if (this.authToken && elapse < 8580000) return;

    if (this.connecting) {
      return new Promise((resolve) => {
        this.waitQueue.push(resolve);
      });
    }

    this.connecting = true;
    try {
      await this.startAuthSign();
    } catch (e) {
      this.connecting = false;
      throw e;
    }
    this.connecting = false;

    log(`wait queue lenght: ${this.waitQueue.length}`);
    while (this.waitQueue.length) {
      const resolve = this.waitQueue.pop();
      resolve();
    }
  }

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

  public async verifyQuery(gyuId: string, reqId: string): Promise<any> {
    const body = {
      appId: this.options.appId,
      gyuId: gyuId,
      reqId: reqId,
    };
    return this.request({
      url: '/verify_query',
      body,
    });
  }
}
