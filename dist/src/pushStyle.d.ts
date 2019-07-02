export declare class Style {
    /**
     * 收到通知是否响铃：true响铃，false不响铃。默认响铃
     */
    isRing: boolean;
    /**
     * 收到通知是否振动：true振动，false不振动。默认振动
     */
    isVibrate: boolean;
    /**
     * 通知是否可清除： true可清除，false不可清除。默认可清除
     */
    isClearable: boolean;
    /**
     * 通知的图标名称，包含后缀名（需要在客户端开发时嵌入），如“push.png”
     */
    logo: string;
    toObject(): any;
}
/**
 * 系统样式
 */
export declare class SystemStyle extends Style {
    readonly type: number;
    /**
     * 通知标题
     */
    text: string;
    /**
     * 通知内容
     */
    title: string;
    toObject(): any;
}
/**
 * 个推样式
 */
export declare class GetuiStyle extends Style {
    readonly type: number;
    /**
     * 通知标题
     */
    text: string;
    /**
     * 通知内容
     */
    title: string;
    /**
     * 通知图标URL地址
     */
    logoUrl: string;
    toObject(): any;
}
/**
 * 纯图样式(背景图样式)
 */
export declare class ImageStyle extends Style {
    readonly type: number;
    /**
     * 通过url方式指定动态banner图片作为通知背景图
     */
    bannerUrl: string;
    toObject(): any;
}
/**
 * 展开通知样式
 */
export declare class ExpandStyle extends Style {
    readonly type: number;
    /**
     * 通知标题
     */
    text: string;
    /**
     * 通知内容
     */
    title: string;
    /**
     * 通知图标URL地址
     */
    logoUrl: string;
    /**
     * 通知展示样式,枚举值包括 1,2,3
     */
    bigStyle: string;
    /**
     * 通知大图URL地址
     */
    bigImageUrl: string;
    /**
     * 通知展示文本+长文本样式，参数是长文本
     */
    bigText: string;
    /**
     * 通知小图URL地址
     */
    bannerUrl: string;
    toObject(): any;
}
