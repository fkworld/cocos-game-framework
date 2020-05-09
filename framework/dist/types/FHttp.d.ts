/**
 * 网络连接模块
 * - TODO：未完整实现，未测试，这里仅作为一个范例。我还没有做过联网项目。
 */
export declare namespace FHttp {
    /**
     * fetch+get+json
     * @param url
     */
    const fetch_get_json: (url: string) => Promise<object>;
    /**
     * fetch+post+json
     * @param url
     * @param body
     */
    const fetch_post_json: (url: string, body: object) => Promise<object>;
    /**
     * XMLHttpRequest+get+json
     * @param url
     */
    const xhr_get_json: (url: string) => Promise<object>;
    /**
     * XMLHttpRequest+post+json
     * @param url
     * @param body
     */
    const xhr_post_json: (url: string, body: object) => Promise<object>;
}
