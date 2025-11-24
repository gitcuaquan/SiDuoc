import type { CustomerResponse } from "~/model/customer/Customer";
import BaseService from "./BaseService";

export default class CustomerService extends BaseService {
    constructor() {
        super('CustomerTapmed');
    }
    // Lấy chi tiết khách hàng theo mã khách hàng
    detail(ma_kh?: string) {
        return this.post('/details', { ma_kh }, undefined, true);
    }
}
