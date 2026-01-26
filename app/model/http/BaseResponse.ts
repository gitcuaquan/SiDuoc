export type Pagination = {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
};

export class BaseResponse<T> {
  statusCode: number;
  isSucceeded: boolean;
  message: string;
  data:
    | {
        totalCount?: number;
        pageIndex?: number;
        pageSize?: number;
        items?: T[];
      }
    | T[];
  constructor(init: Partial<BaseResponse<T>>) {
    this.statusCode = init.statusCode || 400;
    this.isSucceeded = init.isSucceeded || false;
    this.message = init.message || "";
    this.data = init.data || {};
  }
  // lay danh sach items
  get getData() {
    if (Array.isArray(this.data)) {
      return this.data;
    }
    return this.data.items || [];
  }

  get pagination(): Pagination {
    if (!Array.isArray(this.data)) {
      return {
        totalCount: this.data.totalCount || 0,
        pageIndex: this.data.pageIndex || 0,
        pageSize: this.data.pageSize || 0,
      };
    }
    return {
      totalCount: 0,
      pageIndex: 0,
      pageSize: 0,
    };
  }
}

export class BaseResponseOne<T> {
  statusCode: number;
  isSucceeded: boolean;
  message: string;
  data: T | null;
  applicableVouchers:
    | {
        voucherCode: string;
        voucherName: string;
      }[]
    | null;
  constructor(init: Partial<BaseResponseOne<T>>) {
    this.statusCode = init.statusCode || 400;
    this.isSucceeded = init.isSucceeded || false;
    this.message = init.message || "";
    this.data = init.data || null;
    this.applicableVouchers = init.applicableVouchers || null;
  }
}
