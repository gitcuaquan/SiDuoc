import type { TapmedOrder, TapmedOrderItem } from "~/model/item/ITemsTapmed";
import BaseService from "./BaseService";
import { BaseResponse, BaseResponseOne } from "~/model/http/BaseResponse";
import type { BodyFilter } from "~/model";

export class OrderService extends BaseService {
    constructor() {
        super('OrderTapmed');
    }
    createOrder(orderData: TapmedOrder) {
        return this.post('/import', JSON.stringify(orderData), undefined, true);
    }
    async detail(id: string) {
        const res = await this.get<TapmedOrder>(`/${id}`, {
            userId: 0
        });
        return res as BaseResponseOne<TapmedOrder>;
    }
    async listOrder(filter?: BodyFilter<TapmedOrderItem>) {
        const res = await this.post(`/orders/minimal`, JSON.stringify(filter || {}), undefined, true);
        return new BaseResponse<TapmedOrderItem>(res);
    }
    async listVanChuyen(filter?: BodyFilter<TapmedOrder>) {
        const res = await this.post(`/htvc`, JSON.stringify(filter || {}), undefined, true);
        return res;
    }
    async createTicket(body:any){
        const res = await this.post(`/dxa/update-flags`, JSON.stringify(body), undefined, true);
        return res;
    }
}