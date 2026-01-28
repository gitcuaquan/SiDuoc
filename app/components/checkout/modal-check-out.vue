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
          <h5 class="mb-0">Xác nhận đơn hàng</h5>
          <button
            data-bs-dismiss="modal"
            class="btn btn-light ms-auto btn-sm rounded-circle px-1 shadow-sm"
          >
            <X :stroke-width="1" />
          </button>
        </div>
        <template v-if="!idOrder">
          <div class="modal-body" style="min-height: 70vh">
            <section class="mb-3">
              <!-- {{ user }} -->
              <div class="row g-3">
                <div class="col-lg-8">
                  <div class="mb-2 bg-white">
                    <!-- <h6 class="text-dark fw-bold">Thông tin khách hàng :</h6> -->
                    <table class="table m-0 table-borderless table-sm">
                      <tbody>
                        <tr>
                          <td class="fw-bold text-muted" style="width: 100px">
                            Họ và tên
                          </td>
                          <td>: {{ user?.data?.ten_kh }}</td>
                        </tr>
                        <tr>
                          <td class="fw-bold text-muted">SĐT</td>
                          <td>: {{ user?.data?.dien_thoai }}</td>
                        </tr>
                        <tr>
                          <td class="fw-bold text-muted">Địa chỉ</td>
                          <td>
                            : {{ user?.data?.dia_chi }} -
                            {{ user?.data?.ten_xa_phuong }} -
                            {{ user?.data?.ten_thanh_pho }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <CartModuleList2 is-show />
                </div>
                <div class="col-lg-4">
                  <div class="" v-if="prevOrder">
                    <CartModuleSummary is-show>
                      <div class="my-3">
                        <label for="dien_gian"> Ghi chú đơn hàng </label><br />
                        <textarea
                          id="dien_gian"
                          v-model="prevOrder!.header!.ghi_chu_giao_hang"
                          class="form-control"
                          rows="3"
                        ></textarea>
                      </div>

                      <small class="text-muted">
                        Đối với các sản phẩm có đơn giá
                        <b class="fst-normal fw-bold text-primary">"Liên hệ"</b
                        >. <br />
                        Bộ phận kinh doanh sẽ phản hồi và báo giá trực tiếp đến
                        quý khách hàng.
                      </small>
                    </CartModuleSummary>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="modal-footer">
            <button
              data-bs-dismiss="modal"
              class="btn btn-outline-secondary border-0 ms-auto"
            >
              Đóng
            </button>
            <button @click="createOrder" class="btn btn-primary ms-2">
              Đặt đơn
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
              <a
                @click="viewOrder"
                class="text-primary fw-semibold"
                style="cursor: pointer"
              >
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
import { Modal, Toast } from "bootstrap";
import { TapmedOrder, TapmedOrderHeader } from "~/model/item/ITemsTapmed";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { user } = useAuth();
const { prevOrder, resetOrder, globalOrder } = useOrder();
const { $appServices } = useNuxtApp();
const { clearCart, cart } = useCart();
const idOrder = ref("");
const loading = ref(false);
const shippingMethods = ref<Array<any>>([]);
// order để post
const order = ref<TapmedOrder>(
  new TapmedOrder({
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
  }),
);
const modalInstance = ref<Modal | null>(null);

onMounted(async () => {
  initModal();
  // Nếu prevOrder chưa có, khởi tạo từ cart
  if (!prevOrder.value) {
    await initPrevOrder();
  }
});

async function initPrevOrder() {
  loading.value = true;
  try {
    // Build order details từ cart
    globalOrder.value.details = cart.value.map((item) => ({
      ten_vt: item.ten_vt,
      ma_vt: item.ma_vt,
      so_luong: item.quantity || 0,
      gia_nt2: item.gia_nt2 || 0,
      dvt: item.dvt,
    }));

    // Gọi API để apply discount và lấy tổng quan đơn hàng
    const response = await $appServices.discount.applyDiscount(
      globalOrder.value,
    );
    prevOrder.value = response.data as TapmedOrder;
  } catch (error) {
    console.error("Error initializing order:", error);
  } finally {
    loading.value = false;
  }
}

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
  if (!prevOrder.value) {
    useToast().error("Không có thông tin đơn hàng!");
    return;
  }
  loading.value = true;
  const requestBody = prevOrder.value;
  $appServices.order
    .createOrder(requestBody)
    .then(async (res) => {
      loading.value = false;
      idOrder.value = res.data.stt_rec;

      // Log order: ghi lại request body và response
      try {
        await $fetch("/api/logOrder", {
          method: "POST",
          body: {
            request: requestBody,
            response: res,
          },
        });
      } catch (logError) {
        console.error("Failed to log order:", logError);
      }

      clearCart();
      resetOrder();
    })
    .catch(() => {
      useToast().error("Tạo đơn hàng thất bại, vui lòng thử lại sau !");
    })
    .finally(() => {
      loading.value = false;
    });
}
function viewOrder() {
  modalInstance.value?.hide();
  useRouter().push(`/auth?order_id=${idOrder.value}`);
}
</script>

<style></style>
