import { proxyRequest, getCookie } from 'h3'
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token_in_cookie = getCookie(event, 'tapmed_token_access')
    const path = event.path.replace('/api/proxy/', '')

    const targetUrl = `${config.public.apiBase}/${path}`

    const token = event.req.headers['authorization']

    return proxyRequest(event, targetUrl, {
        headers: {
            "api-sse-code": "e0cc6288e60584582eb706fd6c2612e1",
            authorization: token
                ? token
                : token_in_cookie
                    ? `Bearer ${token_in_cookie}`
                    : ''

        }
    })
})