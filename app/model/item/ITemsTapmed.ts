export type ITemsTapmed = {
    ma_vt: string;
    ten_vt: string;
    dvt: string;
    ma_nt?: string;
    gia_nt2: number;
    gia2: number;
    ma_gia?: string;
    ngay_ban?: string;
    image_urls?: { originalName: string, url: string }[];
    mo_ta_san_pham?: string;
    tac_dung_phu?: string;
    luu_y?: string;
    bao_quan?: string;
    thanh_phan?: string;
    cong_dung?: string;
    cach_dung?: string;
    // Số lượng tạm thêm vào giỏ hàng [ chỉ ở client ]
    quantity?: number;
}


export type TapmedDiscount = {
    gio_bd: string;
    gio_kt: string;
    loai_ck: string;
    ma_ck: string;
    ngay_bd: string;
    ngay_kt: string;
    ten_ck: string;
}

export class TapmedOrderHeader {
    stt_rec?: string;
    so_ct?: string;
    tien_hang_nt: number = 0;
    thue_nt: number = 0;
    tong_tt_nt: number = 0;
    ma_kh?: string;
    dien_giai?: string;
    so_dt?: string;
    dia_chi?: string;
    email?: string;
    ngay_ct?: string | Date;
    ma_gd?: string;
    status: number|string = '0';
    ma_nt?: string;
    ty_gia?: number;
    ten?: string;
    kenh_ban?: string;
    kho_ban?: string;
    bang_gia?: string;
    ghi_chu_giao_hang?: string;
    mahtvc?: string ; // phương thức vận chuyển
    fnote3?: string ; // phươ thức thanh toán
    voucher_code?: string;
    constructor(value: Partial<TapmedOrderHeader>) {
        Object.assign(this, value);
        if (!this.status) {
            this.status = 0;
        }
        if (!this.ty_gia) {
            this.ty_gia = 1;
        }
        if (!this.kenh_ban) {
            this.kenh_ban = '';
        }
        if (!this.ma_kh) {
            this.ma_kh = '';
        }
        if (!this.dien_giai) {
            this.dien_giai = '';
        }
        if (!this.so_dt) {
            this.so_dt = '';
        }
        if (!this.dia_chi) {
            this.dia_chi = '';
        }
        if (!this.email) {
            this.email = '';
        }
        if (!this.ma_gd) {
            this.ma_gd = '';
        }
        if (!this.ma_nt) {
            this.ma_nt = '';
        }
        if (!this.ten) {
            this.ten = '';
        }
        if (!this.kho_ban) {
            this.kho_ban = '';
        }
        if (!this.bang_gia) {
            this.bang_gia = '';
        }
        if (!this.voucher_code) {
            this.voucher_code = '';
        }
        if (!value.ngay_ct) {
            this.ngay_ct = new Date();
        }
    }
}

export class TapmedOrderDetail {
    ten_vt?: string;
    ma_vt?: string;
    dvt?: string;
    so_luong?: number;
    gia_nt2?: number;
    ma_thue?: string;
    km_yn?: number;
    ma_kho?: string;
    tl_ck?: number;
    ck_nt?: number;
    ghi_chu?: string;
    gc_td1?: string;
}

export class TapmedOrder {
    header?: TapmedOrderHeader;
    details?: TapmedOrderDetail[];
    userId?: number;
    maDvcs?: string;
    lang?: string;
    constructor(value: Partial<TapmedOrder>) {
        Object.assign(this, value);
        if (!value.header) {
            this.header = new TapmedOrderHeader({});
            Object.assign(this.header, value.header);
        }

    }
}

export class TapmedOrderItem {
    tong_tien?: number;
    stt_rec?: string;
    ngay_ct?: string | Date;
    status?: string;
    status_soan_hang: number = 0;
    status_giao_van: number = 0;
    so_ct?: string;
    created_by?: string;
    item_count?: number;
    constructor(value: Partial<TapmedOrderItem>) {
        Object.assign(this, value);
    }
}
export const StatusSoanHang = [
    "Đang cập nhật",
    "Chuyển kho",
    "Mới chia đơn",
    "Đang xử lý",
    "Chờ đóng gói",
    "Đã đóng gói",
    "Đang đóng gói"
];

export const StatusGiaoVan = [
    "Đang cập nhật",
    "Chờ giao",
    "Đã giao",
    "Thất bại"
]