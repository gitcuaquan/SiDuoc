<template>
  <div class="modal fade" id="modal-register" tabindex="-1">
    <div
      class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div
          style="z-index: 999999"
          v-if="loading"
          class="text-center position-absolute d-flex flex-column gap-5 bg-blur w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
        >
          <UiLoading />
          Đang tạo đơn hàng ...
        </div>
        <div class="modal-header">
          <h5 class="mb-0">Tạo đơn hàng nhanh</h5>
          <button
            data-bs-dismiss="modal"
            class="btn btn-light ms-auto btn-sm rounded-circle px-1 shadow-sm"
          >
            <X :stroke-width="1" />
          </button>
        </div>
        <template v-if="!idOrder">
          <div class="modal-body" style="min-height: 70vh">
            {{ idOrder }}
            <section class="mb-3">
              <!-- {{ user }} -->
              <div class="row">
                <div class="col-lg-5">
                  <h6 class="text-dark fw-bold">Thông tin khách hàng :</h6>
                  <table class="table m-0 table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td class="fw-normal text-muted" style="width: 110px">
                          Họ và tên
                        </td>
                        <td>: {{ user?.ten_kh }}</td>
                      </tr>
                      <tr>
                        <td class="fw-normal text-muted">Số điện thoại</td>
                        <td>: {{ user?.dien_thoai }}</td>
                      </tr>
                      <tr>
                        <td class="fw-normal text-muted">Địa chỉ</td>
                        <td>
                          : {{ user?.dia_chi }} - {{ user?.ten_xa_phuong }} -
                          {{ user?.ten_thanh_pho }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- <small class="text-muted fw-light fst-italic">
                    Theo mặc định các thông tin trên được lấy từ hồ sơ khách hàng và
                    đã được xác nhận, các thông tin này sẽ được làm căn cứ cho địa
                    chỉ giao hàng .
                  </small> -->
                </div>
                <div class="col-lg-4">
                  <h6 class="text-dark fw-bold">Phương thức vận chuyển :</h6>
                  <div
                    class="form-check"
                    v-for="(method, index) in shippingMethods"
                    :key="method.ma_htvc"
                  >
                    <input
                      class="form-check-input"
                      type="radio"
                      name="shippingMethod"
                      :value="method.ma_htvc"
                      v-model="order.header!.mahtvc"
                      :id="`shippingMethod${method.ma_htvc}`"
                    />
                    <label
                      class="form-check-label"
                      :for="`shippingMethod${method.ma_htvc}`"
                    >
                      {{ method.ten_htvc }}
                    </label>
                  </div>
                </div>
                <div class="col-lg-3">
                  <h6 class="text-dark fw-bold">Phương thức thanh toán:</h6>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cod"
                      value="1"
                      v-model="order.header!.fnote3"
                    />
                    <label class="form-check-label" for="cod">
                      Thanh toán khi nhận hàng (COD)
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      value="2"
                      type="radio"
                      name="paymentMethod"
                      id="bankTransfer"
                      v-model="order.header!.fnote3"
                    />
                    <label class="form-check-label" for="bankTransfer">
                      Thanh toán chuyển khoản ngân hàng
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h6 class="text-dark">Chi tiết đơn hàng :</h6>
              <div class="row">
                <div class="col-lg-8">
                  <CartModuleList />
                </div>
                <div class="col-lg-4">
                  <CartModuleSummary>
                    <div class="my-3">
                      <label for="dien_gian"> Ghi chú đơn hàng </label><br />
                      <small class="text-muted fw-light fst-italic">
                        Thêm các thông tin cần chăm sóc viên chú ý.
                      </small>
                      <textarea
                        id="dien_gian"
                        v-model="order.header!.ghi_chu_giao_hang"
                        class="form-control"
                        rows="3"
                      ></textarea>
                    </div>
                    <small class="fst-italic text-muted">
                      Chú ý: Các sản phẩn có đơn giá hiên thị <br />
                      <b class="fst-normal fw-bold text-primary">liên hệ</b> sẽ
                      được nhân viên của chúng tôi liên hệ để báo giá cụ thể
                      trước khi tiến hành xử lý đơn hàng.</small
                    >
                  </CartModuleSummary>
                </div>
              </div>
            </section>
          </div>
          <div class="modal-footer">
            <button
              data-bs-dismiss="modal"
              class="btn btn-outline-dark border-0 ms-auto fw-semibold"
            >
              Đóng Tạo Đơn Hàng
            </button>
            <button
              @click="createOrder"
              class="btn btn-primary ms-2 fw-semibold"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </template>
        <template v-else>
          <div class="modal-body text-center py-5">
            <CheckCircle :size="300" class="text-success mb-3" />
            <h5 class="mb-3">Tạo đơn hàng thành công !</h5>
            <p class="text-muted">
              Cảm ơn bạn đã đặt hàng, chúng tôi sẽ liên hệ với bạn sớm nhất có
              thể.
            </p>
            <p>
              <a @click="viewOrder" class="text-primary fw-semibold" style="cursor: pointer">
                Xem chi tiết đơn hàng {{ idOrder }}
              </a>
            </p>
            <button
              @click="modalInstance?.hide()"
              class="btn btn-success mt-4 px-4 fw-semibold"
            >
              Đóng
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from "bootstrap";
import { TapmedOrder, TapmedOrderHeader } from "~/model/item/ITemsTapmed";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { user } = useAuth();
const { $appServices } = useNuxtApp();
const idOrder = ref("");
const loading = ref(false);
const shippingMethods = ref<Array<any>>([]);
// order để post
const order = ref<TapmedOrder>(
  new TapmedOrder({
    details: [],
    header: new TapmedOrderHeader({
      ma_kh: user.value?.ma_kh || "",
      so_dt: user.value?.dien_thoai || "",
      dia_chi: user.value?.dia_chi || "",
      ten: user.value?.ten_kh || "",
      ghi_chu_giao_hang: "",
      status: "0",
      fnote3: "1", // phương thức thanh toán: 1: COD, 2: chuyển khoản
      mahtvc: "01", // phương thức vận chuyển
    }),
  })
);
const modalInstance = ref<Modal | null>(null);

onMounted(() => {
  initModal();
});

function initModal() {
  const modal = document.getElementById("modal-register");
  modalInstance.value = new Modal(modal!, {
    backdrop: "static",
    keyboard: false,
  });
  modalInstance.value.show();
  modal!.addEventListener("hidden.bs.modal", () => {
    emit("close");
  });
}

$appServices.order.listVanChuyen().then((res: { data?: { data?: any } }) => {
  shippingMethods.value = res.data?.data as any;
});

function createOrder() {
  order.value.details = useCart().cart.value.map((item) => ({
    ma_vt: item.ma_vt,
    so_luong: item.quantity || 0,
    gia_nt2: item.gia_nt2 || 0,
  }));
  loading.value = true;
  $appServices.order.createOrder(order.value).then((res) => {
    loading.value = false;
    idOrder.value = res.data.stt_rec;
  });
}
function viewOrder() {
  modalInstance.value?.hide();
  useRouter().push(`/auth?order_id=${idOrder.value}`);
}
</script>

<style></style>
