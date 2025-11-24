<template>
  <div class="modal fade" id="modal-register" tabindex="-1">
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chi tiết đơn hàng</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-0">
          <div class="order-header-info mb-2 p-3 ">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div>
                  <strong>Mã đơn hàng:</strong>
                  <span class="text-primary">{{
                    orderDetails?.data?.header?.stt_rec
                  }}</span>
                </div>
                <div>
                  <strong>Ngày đặt:</strong>
                  <span>
                    {{
                      formatDate(orderDetails?.data?.header?.ngay_ct as string)
                    }}
                  </span>
                </div>
                <div>
                  <strong>Số chứng từ:</strong>
                  <span>{{ orderDetails?.data?.header?.so_ct }}</span>
                </div>
                <div>
                  <strong>Mã khách hàng:</strong>
                  <span>{{ orderDetails?.data?.header?.ma_kh }}</span>
                </div>
                <div>
                  <strong>Ghi chú:</strong>
                  <span> {{ orderDetails?.data?.header?.ghi_chu_giao_hang }}</span>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div>
                  <strong>Tổng tiền hàng:</strong>
                  <span class="fw-semibold text-success">{{
                    formatCurrency(
                      orderDetails?.data?.header?.tien_hang_nt ?? 0
                    )
                  }}</span>
                </div>
                <div>
                  <strong>Thuế:</strong>
                  <span>{{
                    formatCurrency(orderDetails?.data?.header?.thue_nt ?? 0)
                  }}</span>
                </div>
                <div>
                  <strong>Tổng thanh toán:</strong>
                  <span class="fw-bold text-danger">{{
                    formatCurrency(orderDetails?.data?.header?.tong_tt_nt ?? 0)
                  }}</span>
                </div>
                <div>
                  <strong>Trạng thái:</strong>
                  <span>
                    {{
                      orderDetails?.data?.header?.status !== undefined
                        ? StatusGiaoVan[
                            orderDetails.data.header.status as number
                          ]
                        : ""
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="cart-header d-none border d-lg-table-row bg-light fw-semibold"
          >
            <span class="d-lg-table-cell p-3 py-2">Sản phẩm</span>
            <span class="d-lg-table-cell p-3 py-2 text-center">Giá</span>
            <span class="d-lg-table-cell p-3 py-2 text-center text-nowrap"
              >Số lượng</span
            >
            <span class="d-lg-table-cell p-3 py-2 text-end">Tổng</span>
          </div>

          <!-- Item -->
          <div
            v-for="detail in orderDetails?.data?.details"
            class="cart-item d-block d-lg-table-row align-middle border rounded-3 p-3 mb-3 bg-white shadow-sm"
          >
            <!-- Product -->
            <div
              class="cart-product mb-lg-0 mb-3 d-flex align-items-center gap-3 d-lg-table-cell p-lg-3"
            >
              <div class="d-flex align-items-center">
                <img
                  src="https://placehold.co/400"
                  width="60"
                  height="60"
                  class="rounded border"
                  alt="Sản phẩm"
                />
                <span class="fw-medium ms-2">{{ detail.ten_vt }}</span>
              </div>
            </div>

            <!-- Price -->
            <div
              class="cart-price text-lg-end d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
            >
              <span class="d-lg-none fw-semibold">Giá:</span>
              <span class="text-lg-center">
                {{ formatCurrency(detail.gia_nt2 as number) }}</span
              >
            </div>

            <!-- Quantity -->
            <div
              class="cart-qty align-middle d-flex text-lg-center mb-2 mb-lg-0 justify-content-between align-items-center d-lg-table-cell p-lg-3"
            >
              <span class="d-lg-none fw-semibold">Số lượng:</span>
              {{ detail.so_luong }}
            </div>

            <!-- Total -->
            <div
              class="cart-total align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
            >
              <span class="d-lg-none fw-semibold">Tổng:</span>
              <span class="fw-bold text-success text-lg-end">{{
                formatCurrency(
                  (detail.gia_nt2 as number) * (detail.so_luong as number)
                )
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from "bootstrap";
import type { BaseResponseOne } from "~/model/http/BaseResponse";
import { StatusGiaoVan, type TapmedOrder } from "~/model/item/ITemsTapmed";

const modalInstance = ref<Modal | null>(null);
const { $bootstrap, $appServices } = useNuxtApp();
const props = defineProps<{
  order_id: string;
}>();
const emit = defineEmits(["close", "ticket"]);

const orderDetails = ref<BaseResponseOne<TapmedOrder> | null>(null);

onMounted(() => {
  initModal();
  getDetailOrder();
});

function initModal() {
  const modal = document.getElementById("modal-register");
  modalInstance.value = new $bootstrap.Modal(modal!);
  modalInstance.value.show();
  modal!.addEventListener("hidden.bs.modal", () => {
    emit("close");
  });
}
function createTicket() {
  modalInstance.value?.hide();
  emit("ticket");
}

async function getDetailOrder() {
  try {
    const res = await $appServices.order.detail(props.order_id);
    orderDetails.value = res;
  } catch (error) {
    console.log("🚀 ~ getDetailOrder ~ error=>", error);
  }
}
</script>

<style></style>
