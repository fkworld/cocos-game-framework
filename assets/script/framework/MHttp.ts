import { MLog } from "./MLog";

/**
 * [M] 网络连接
 * - [用法] 这里只是给出了一个样例,实际使用中http请求需要更加定制化
 * - [注意] 考虑await无法对reject()进行处理,需要进行try-catch封装,并在catch中返回null
 * - [注意] 需要处理浏览器跨域请求;如果是cros方案,需要后端(目标url)进行配合才可以实现
 */
export class MHttp {

    /**
     * fetch+post+json
     * @param url 
     * @param body 建议前后端使用interface规定类型
     */
    static async fetch_post_json(url: string, body: object): Promise<object> {
        try {
            let response = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(body),
            })
            let json = await response.json()
            return json
        } catch (error) {
            MLog.error(error)
            return null
        }
    }

}