import { TapmedOrder, TapmedOrderHeader } from "~/model/item/ITemsTapmed";

export const useOrder = () => {
  const { user } = useAuth();

  const discountManager = useState<any>("discountManager", () => []);

  const globalOrder = useState<TapmedOrder>("globalOrder", () => new TapmedOrder({
    details: [],
    header: new TapmedOrderHeader({
      ma_kh: user.value?.data?.ma_kh || "",
      so_dt: user.value?.data?.dien_thoai || "",
      dia_chi: user.value?.data?.dia_chi || "",
      ten: user.value?.data?.ten_kh || "",
      ghi_chu_giao_hang: "",
      status: "0",
      fnote3: "1", // phương thức thanh toán: 1: COD, 2: chuyển khoản
      mahtvc: "01", // phương thức vận chuyển
    }),
    selectedDiscounts: [],
  }));

  const prevOrder = useState<TapmedOrder | null>("prevOrder", () => null);

  // Watch user để cập nhật thông tin order khi user thay đổi
  watch(() => user.value?.data?.ma_kh, (newMaKh, oldMaKh) => {
    if (newMaKh !== oldMaKh) {
      // Ensure header exists before updating when user changes
      if (!globalOrder.value.header) {
        globalOrder.value.header = new TapmedOrderHeader({
          ma_kh: user.value?.data?.ma_kh || "",
          so_dt: user.value?.data?.dien_thoai || "",
          dia_chi: user.value?.data?.dia_chi || "",
          ten: user.value?.data?.ten_kh || "",
          ghi_chu_giao_hang: "",
          status: "0",
          fnote3: "1",
          mahtvc: "01",
          voucher_code: "",
        });
      } else {
        // Reset order khi user thay đổi
        globalOrder.value.header.ma_kh = user.value?.data?.ma_kh || "";
        globalOrder.value.header.so_dt = user.value?.data?.dien_thoai || "";
        globalOrder.value.header.dia_chi = user.value?.data?.dia_chi || "";
        globalOrder.value.header.ten = user.value?.data?.ten_kh || "";
      }
    }
  }, { immediate: true });

  function resetOrder() {
    globalOrder.value = new TapmedOrder({
      details: [],
      header: new TapmedOrderHeader({
        ma_kh: user.value?.data?.ma_kh || "",
        so_dt: user.value?.data?.dien_thoai || "",
        dia_chi: user.value?.data?.dia_chi || "",
        ten: user.value?.data?.ten_kh || "",
        ghi_chu_giao_hang: "",
        status: "0",
        fnote3: "1", // phương thức thanh toán: 1: COD, 2: chuyển khoản
        mahtvc: "01", // phương thức vận chuyển
        voucher_code: "",
      }),
      selectedDiscounts: [],
    });
  }

  return { globalOrder, resetOrder, prevOrder, discountManager };
}
