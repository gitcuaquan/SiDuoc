
export interface FetchOptions {
    params?: Record<string, any>
    body?: any
    headers?: Record<string, string>
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    retry?: boolean // để tránh loop khi refresh fail
    auth?: boolean // để xác định có cần thêm token hay không
}


export default class BaseService {
    protected baseUrl: string = '/api/proxy/';
    protected defaultHeaders: Record<string, string>
    private NAME_TOKEN_IN_COOKIE: string = 'tapmed_token_access';
    constructor(endpoint: string) {
        this.baseUrl += endpoint;
        this.defaultHeaders = {

        }
    }
    /**
     * Get the full URL for a specific endpoint path
     * @param path endpoint path
     * @returns full URL
     */
    protected getFullUrl(path: string = ''): string {
        return `${this.baseUrl}${path}`;
    }

    protected async request<T = any>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        try {
            const { method = 'GET', params, body, headers, auth } = options
            const requestHeaders = { ...this.defaultHeaders, ...headers }

            if (auth) {
                const _token = useCookie(this.NAME_TOKEN_IN_COOKIE).value;
                if (_token) {
                    requestHeaders['Authorization'] = `Bearer ${_token}`;
                }
            }

            // Tự động set Content-Type nếu có body
            if (body) {
                if (!requestHeaders['Content-Type']) {
                    requestHeaders['Content-Type'] = 'application/json'
                }
            }

            return await $fetch<T>(`${this.baseUrl}${endpoint}`, {
                method,
                params,
                body,
                headers: requestHeaders,
            })
        } catch (error: any) {
            console.error(`[BaseService Error]:`, error)
            throw error
        }
    }

    protected get<T = any>(endpoint: string, params?: Record<string, any>, auth: boolean = false) {
        return this.request<T>(endpoint, { method: 'GET', params, auth })
    }

    protected post<T = any>(endpoint: string, body?: any, params?: Record<string, any>, auth: boolean = false) {
        return this.request<T>(endpoint, { method: 'POST', body, params, auth })
    }

    protected put<T = any>(endpoint: string, body?: any, params?: Record<string, any>, auth: boolean = false) {
        return this.request<T>(endpoint, { method: 'PUT', body, params, auth })
    }

    protected patch<T = any>(endpoint: string, body?: any, params?: Record<string, any>, auth: boolean = false) {
        return this.request<T>(endpoint, { method: 'PATCH', body, params, auth })
    }

    protected delete<T = any>(endpoint: string, params?: Record<string, any>, auth: boolean = false) {
        return this.request<T>(endpoint, { method: 'DELETE', params, auth })
    }

    async uploadFile(file: File) {
        const uuid = crypto.randomUUID();
        const body = new FormData();
        body.append("file", file);
        body.append("controllerFields", "dmkh");
        body.append("isPublicAccess", "true");
        body.append("keyFields", uuid);
        body.append("slug", uuid + `.` + file.type.split('/')[1]);

        try {
            const response = await $fetch('https://api-tapmed.sse.net.vn/api/FileUpload/upload', {
                method: 'POST',
                body: body,
                headers: {
                    "api-sse-code": "e0cc6288e60584582eb706fd6c2612e1",
                    "Authorization": `Bearer ${useCookie(this.NAME_TOKEN_IN_COOKIE).value}`,
                },
            });
            return response;
        } catch (error) {
            console.error("Upload file error:", error);
            throw error;
        }
    }
}

