export class Customer {
    FullName: string;
    //Chứng chỉ hành nghề dược
    Certificate1: string | File;
    //Giấy chứng nhận đăng ký kinh doanh
    Certificate2: string | File;
    //Giấy chứng nhận đủ điều kiện kinh doanh
    Certificate3: string | File;
    Cccd: string;
    NameCoSo: string;
    PhoneNumber: string;
    Password: string;
    NameProvince: string;
    CodeDistrict: string;
    NameDistrict: string;
    Address: string;
    Certificates: string[];
    SaleID?: string
    constructor(init: Partial<Customer>) {
        this.FullName = init.FullName || '';
        this.Cccd = init.Cccd || '';
        this.NameCoSo = init.NameCoSo || '';
        this.PhoneNumber = init.PhoneNumber || '';
        this.Password = init.Password || '';
        this.NameProvince = init.NameProvince || '';
        this.CodeDistrict = init.CodeDistrict || '';
        this.NameDistrict = init.NameDistrict || '';
        this.Address = init.Address || '';
        this.Certificates = init.Certificates || [];
        this.Certificate1 = init.Certificate1 || '';
        this.Certificate2 = init.Certificate2 || '';
        this.Certificate3 = init.Certificate3 || '';
    }
}

export class CustomerDetail {
    ma_kh: string;
    ten_kh: string;
    ten_kh2: string;
    kh_yn: boolean;
    cc_yn: boolean;
    nv_yn: boolean;
    ma_so_thue: string | null;
    dia_chi: string;
    dien_thoai: string;
    fax: string | null;
    e_mail: string | null;
    cccd: string;
    ten_thanh_pho: string;
    ten_xa_phuong: string;
    co_so: string;
    url_giay_to1: string | null;
    url_giay_to2: string | null;
    url_giay_to3: string | null;

    constructor(init: Partial<CustomerDetail>) {
        this.ma_kh = init.ma_kh || '';
        this.ten_kh = init.ten_kh || '';
        this.ten_kh2 = init.ten_kh2 || '';
        this.kh_yn = init.kh_yn ?? false;
        this.cc_yn = init.cc_yn ?? false;
        this.nv_yn = init.nv_yn ?? false;
        this.ma_so_thue = init.ma_so_thue ?? null;
        this.dia_chi = init.dia_chi || '';
        this.dien_thoai = init.dien_thoai || '';
        this.fax = init.fax ?? null;
        this.e_mail = init.e_mail ?? null;
        this.cccd = init.cccd || '';
        this.ten_thanh_pho = init.ten_thanh_pho || '';
        this.ten_xa_phuong = init.ten_xa_phuong || '';
        this.co_so = init.co_so || '';
        this.url_giay_to1 = init.url_giay_to1 ?? null;
        this.url_giay_to2 = init.url_giay_to2 ?? null;
        this.url_giay_to3 = init.url_giay_to3 ?? null;
    }
}

export class Status {
    isSucceded: boolean;
    message: string;

    constructor(init: Partial<Status>) {
        this.isSucceded = init.isSucceded ?? false;
        this.message = init.message || '';
    }
}

export class Nhom {
    ma_nh: string;
    ten_nh: string;

    constructor(init: Partial<Nhom>) {
        this.ma_nh = init.ma_nh || '';
        this.ten_nh = init.ten_nh || '';
    }
}

export class CustomerResponse {
    status: Status;
    data: CustomerDetail;
    nhoms: Nhom[];

    constructor(init: Partial<CustomerResponse>) {
        this.status = new Status(init.status || {});
        this.data = new CustomerDetail(init.data || {});
        this.nhoms = (init.nhoms || []).map((n: any) => new Nhom(n));
    }
}