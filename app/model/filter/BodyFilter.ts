import { FilterItem } from './FilterItem';
import { OperatorType } from './OperatorType';

/**
 * Lớp mô tả cấu trúc của một yêu cầu lọc dữ liệu với các thuộc tính cần thiết để thực hiện việc lọc, sắp xếp và phân trang.
 * @param T - Kiểu dữ liệu của đối tượng mà bộ lọc sẽ áp dụng.
 * @property filter - Mảng các mục lọc để áp dụng cho dữ liệu.
 * @property order - Mảng các chuỗi xác định thứ tự sắp xếp của dữ liệu.
 * @property pageIndex - Chỉ số trang hiện tại (bắt đầu từ 1).
 * @property pageSize - Số lượng mục trên mỗi trang.
 */
export class BodyFilter<T = any> {
    filters: FilterItem<T>[];
    order: string[];
    pageIndex: number;
    pageSize: number;
    fromDate?: string;
    toDate?: string;
    constructor(init: Partial<BodyFilter<T>>) {
        this.filters = init.filters || [];
        this.order = init.order || [];
        this.pageIndex = init.pageIndex || 1;
        this.pageSize = init.pageSize || 10;
    }
    push(filterItem: FilterItem<T>) {
        this.filters.push(filterItem);
    }

    setValue(filterValue: keyof T | string, valueSearch: string, operatorType: OperatorType = OperatorType.Contains) {
        const existingFilter = this.filters.find(f => f.filterValue === filterValue);
        if (existingFilter) {
            existingFilter.valueSearch = valueSearch;
            existingFilter.operatorType = operatorType;
        } else {
            this.filters.push(new FilterItem<T>({ filterValue, valueSearch, operatorType }));
        }
    }
    resetFilter(filterValue: keyof T | string) {
        const existingFilterIndex = this.filters.findIndex(f => f.filterValue === filterValue);
        if (existingFilterIndex !== -1 && this.filters[existingFilterIndex]) {
            this.filters[existingFilterIndex].valueSearch = '';
        }
    }

    removeFilter(filterValue: keyof T | string,valueSearch?:string) {
        const existingFilterIndex = this.filters.findIndex(f => f.filterValue === filterValue && (valueSearch ? f.valueSearch === valueSearch : true));
        if (existingFilterIndex !== -1) {
            this.filters.splice(existingFilterIndex, 1);
        }
    }
}
