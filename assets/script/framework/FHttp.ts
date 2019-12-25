/**
 * 网络连接模块
 * - 未完整实现，这里只是一个示例。
 */
export namespace FHttp {

    /**
     * fetch+get+json
     * @param url
     */
    export async function fetch_get_json(url: string): Promise<object> {
        try {
            let response = await fetch(url, {
                method: "GET",
                mode: "cors",
                headers: new Headers({ "Content-Type": "application/json" }),
            })
            let json = await response.json()
            return json
        } catch (error) {
            cc.error(error)
            return null
        }
    }

    /**
     * fetch+post+json
     * @param url
     * @param body
     */
    export async function fetch_post_json(url: string, body: object): Promise<object> {
        try {
            let response = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: new Headers({ "Content-Type": "application/json" }),
                body: JSON.stringify(body)
            })
            let json = await response.json()
            return json
        } catch (error) {
            cc.error(error)
            return null
        }
    }

    /**
     * XMLHttpRequest+get+json
     * @param url
     */
    export async function xhr_get_json(url: string): Promise<object> {
        return await new Promise(res => {
            try {
                let xhr = new XMLHttpRequest()
                xhr.responseType = "json"
                xhr.open("GET", url, true)
                xhr.setRequestHeader("Content-Type", "application/json")
                xhr.onerror = () => { throw new Error("xhr-on-error") }
                xhr.ontimeout = () => { throw new Error("xhr-on-timeout") }
                xhr.onreadystatechange = () => {
                    if (xhr.readyState != 4) { return }
                    if (xhr.status >= 200 && xhr.status < 400) {
                        res(xhr.response)
                    } else {
                        throw new Error("xhr-status-not-200-400")
                    }
                }
                xhr.send()
            } catch (error) {
                cc.error(error)
                res(null)
            }
        })
    }

    /**
     * XMLHttpRequest+post+json
     * @param url
     * @param body
     */
    export async function xhr_post_json(url: string, body: object): Promise<object> {
        return await new Promise(res => {
            try {
                let xhr = new XMLHttpRequest()
                xhr.responseType = "json"
                xhr.open("POST", url, true)
                xhr.setRequestHeader("Content-Type", "application/json")
                xhr.onerror = () => { throw new Error("xhr-on-error") }
                xhr.ontimeout = () => { throw new Error("xhr-on-timeout") }
                xhr.onreadystatechange = () => {
                    if (xhr.readyState != 4) { return }
                    if (xhr.status >= 200 && xhr.status < 400) {
                        res(xhr.response)
                    } else {
                        throw new Error("xhr-status-not-200-400")
                    }
                }
                xhr.send(JSON.stringify(body))
            } catch (error) {
                cc.error(error)
                res(null)
            }
        })
    }

}
