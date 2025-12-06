export class DiscountItem {
    applicationCount?: number;
    codeDiscount?: string;
    discountAmount?: number | null;
    discountName?: string;
    discountRate?: number;
    discountType?: keyof typeof DiscountType;
    isExclusive?: boolean;
    isValid?: boolean;
    itemCodeBuy?: string;
    itemCodeGift?: string;
    itemNameGift?: string;
    keyCodeDiscount?: string;
    moneyVoucher?: number;
    quantityGift?: number;
    itemNameBuy?: string;
    totalDiscount?: number;
    maxDiscount?: number;
    nameTypeDiscount?: string;
    constructor(data: Partial<DiscountItem> = {}) {
        Object.assign(this, data);
    }
}

export const DiscountType: Record<string, string> = {
    H: 'Tặng hàng khuyến mại',
    D: 'Chiết theo khấu theo mặt hàng',
    M: 'Chiết theo khấu tổng đơn',
};

export class VoucherItem {
    ghi_chu?: string;
    ma_kh?: string;
    ma_the?: string;
    ngay_hh?: string;
    ngay_ph?: string;
    status?: string;
    ten_the?: string;
    tien_ck?: number;
    tinh_trang?: string;
    tl_ck?: number;
    constructor(data: Partial<VoucherItem> = {}) {
        Object.assign(this, data);
    }
}