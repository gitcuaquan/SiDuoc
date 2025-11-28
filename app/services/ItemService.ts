import { BodyFilter } from './../model/filter/BodyFilter';
import { BaseResponse, type BaseParameters, type ITemsTapmed } from "~/model";
import BaseService from "./BaseService";
import type { BaseResponseOne } from '~/model/http/BaseResponse';

export default class ItemService extends BaseService {
    constructor() {
        super('ItemsTapmed');
    }
    /**
     * Lấy danh sách items với các tham số tùy chọn.
     * @param params 
     * @returns 
     */
    async getItems(filter?: BodyFilter): Promise<BaseResponse<ITemsTapmed>> {
        const resp = await this.post('', filter ? JSON.stringify(filter) : undefined);
        return new BaseResponse<ITemsTapmed>(resp);
    }
    /**
     * Lấy thông tin chi tiết của một item theo ID.
     * @param id 
     * @returns 
     */
    async getItemById(id: string): Promise<BaseResponseOne<ITemsTapmed> | null> {
        const resp = await this.get(`/details/items`, {
            ma_vt: id
        });
        return resp.data ? (resp.data as BaseResponseOne<ITemsTapmed>) : null;
    }

    async getNhomVatTu<T>(filters: BodyFilter) {
        const resp = await this.post('/list-nhvt', JSON.stringify(filters));
        return new BaseResponse<T>(resp);
    }

    async getNhaSX<T>(filters: BodyFilter) {
        const resp = await this.post('/list-nsx', JSON.stringify(filters));
        return new BaseResponse<T>(resp);
    }
    // danh sách sản phẩm yêu thích của người dùng
    async productFavorite<T>(ma_vt: string) {
        const resp = await this.get<T>(`/iteam-fav`, { ma_vt }, true);
        return resp;
    }
    // thêm sản phẩm vào danh sách yêu thích của người dùng
    async addProductFavorite<T>(ma_vt: string) {
        const resp = await this.post<T>(`/add-product-fav`, { ma_vt }, undefined, true);
        return resp;
    }

    async addProductSuggest<T>(BodyFilter: any) {
        const resp = await this.post<T>(`/save/product_top`, JSON.stringify(BodyFilter), undefined, true);
        return resp;
    }
    async productSuggest<T>(param?: BaseParameters) {
        const resp = await this.get(`/list/product_top`, param, true);
        return new BaseResponse<T>(resp);
    }
    async getNhomThuocKinhDoanh<T = any>(filters?: BodyFilter) {
        const resp = await this.post('/nhtkd', JSON.stringify(filters || {}));
        return new BaseResponse<T>(resp);
    }
    // async getFeatured(param?: BaseParameters): Promise<BaseResponse<ITemsTapmed>> {
    //     return this.get('/list/product_top', param);
    // }
}