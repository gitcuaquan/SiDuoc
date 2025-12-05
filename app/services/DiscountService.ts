import { BaseResponse, type BaseParameters, type TapmedDiscount } from "~/model";
import BaseService from "./BaseService";
import type { DiscountItem, VoucherItem } from "~/model/discount";
import type { TapmedOrder } from "~/model/item/ITemsTapmed";

export default class DiscountService extends BaseService {
    constructor() {
        super("DiscountTapmed");
    }
    async getListDiscount(params: BaseParameters): Promise<any> {
        const respone = await this.get("/", params);
        return new BaseResponse<TapmedDiscount>(respone);
    }
    async caculateDiscount(body: any): Promise<BaseResponse<DiscountItem>> {
        const respone = await this.post("/CalculateDiscount", JSON.stringify(body), undefined, true);
        return new BaseResponse<DiscountItem>(respone);
    }
    async applyDiscount(body: any) {
        const respone = await this.post("/ApplyDiscounts", JSON.stringify(body), undefined, true);
        return new BaseResponse<TapmedOrder>(respone);;
    }
    async getVoucherCode(params?: any) {
        const respone = await this.get("/vouchers", params, true);
        return new BaseResponse<VoucherItem>(respone);
    }
}