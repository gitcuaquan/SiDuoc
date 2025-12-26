
import type { BaseResponseOne } from "~/model/http/BaseResponse";
import BaseService from "./BaseService";
import type { Customer } from "~/model";

export default class AuthService extends BaseService {
    constructor() {
        super("Authentication");
    }
    /**
     * Đăng ký khách hàng
     * @param data 
     * @returns 
     */
    // async register(data: FormData) {
    //     try {
    //         const response = await $fetch('https://api-tapmed.sse.net.vn/api/Authentication/RegistrationCustomer', {
    //             method: 'POST',
    //             body: data,
    //             headers: {
    //                 "api-sse-code": "e0cc6288e60584582eb706fd6c2612e1",
    //             },
    //         });
    //         return response as BaseResponseOne<Customer>;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async register(data: FormData) {
        try {
            return this.request("/RegistrationCustomer", {
                method: 'POST',
                body: data,
            });
        } catch (error) {
            throw error;
        }
    }
    /**
     * Đăng nhập khách hàn
     * @param data  
     * @returns 
     */
    login<T>(data: { userName: string; password: string }): Promise<T> {
        return this.request("/CustomerLogin", { method: 'POST', body: data });
    }

}