<template>
  <div class="cart-summary bg-white p-4" v-bind="$attrs">
    <h5 class="fw-semibold mb-3">Tổng quan</h5>
    <div class="d-flex justify-content-between mb-2">
      <span>Tổng tiền hàng</span>
      <span>{{ formatCurrency(totalPrice) }}</span>
    </div>
    <ui-popover v-if="listVoucher?.getData.length">
      <template #trigger>
        <span class="text-primary" style="cursor: pointer">
          <Gift :size="16" :stroke-width="1.75" />
          <small>
            Đang có {{ listVoucher?.getData.length }} mã giảm giá có thể áp dụng
          </small></span
        >
      </template>
      <template #content>
        <div class="p-2" style="width: 320px">
          <strong>Mã giảm giá có thể áp dụng:</strong>
          <div
            v-for="voucher in listVoucher?.getData"
            :key="voucher.ma_the"
            class="d-flex justify-content-between align-items-center w-100 border p-1 rounded"
          >
            <div class="">
              <div class="fw-semibold">{{ voucher.ten_the }}</div>
              <div class="text-secondary" style="font-size: 12px">
                Mã: {{ voucher.ma_the }}
              </div>
              <div class="text-secondary fw-normal" style="font-size: 12px">
                {{ formatDate(voucher.ngay_ph) }} -
                {{ formatDate(voucher.ngay_hh) }}
              </div>
            </div>
            <div class="d-flex flex-column">
              <button
                @click="applyVoucher(voucher.ma_the)"
                class="btn-sm btn btn-primary mb-1"
                style="font-size: 12px"
              >
                Áp dụng
              </button>
              <div class="text-danger fw-bold">
                - {{ formatCurrency(voucher.tien_ck || 0) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </ui-popover>
    <div class="mt-2">Mã giảm giá đã áp dụng :</div>
    <div class="d-flex">
      <div class="badge bg-primary fw-normal d-flex align-items-center gap-1">
        <TicketCheck :size="16" :stroke-width="2" />
        {{ globalOrder.header?.voucher_code || "Chưa áp dụng mã giảm giá" }}
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div>
        <span>Khuyến mãi </span>
        <span
          class="badge gap-1 ps-0 fw-normal bg-transparent text-primary d-flex align-items-center"
        >
          <b>{{ listDiscount?.getData?.length || 0 }}</b> chương trình có thể áp
          dụng
        </span>
      </div>
      <button
        @click="isShowListDiscount = true"
        class="btn btn-sm btn-light shadow-sm"
      >
        Xem Thêm
      </button>
    </div>
    <div class="d-flex flex-wrap gap-2">
      <div
        role="button"
        class="badge text-primary"
        v-for="value in discountSelected"
      >
        <TicketPercent :size="16" :stroke-width="2" /> {{ value.discountName }}
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between mb-3">
      <span>Tổng tiền chiết khấu</span>
      <span class="text-danger">- {{ formatCurrency(100000) }}</span>
    </div>
    <hr />
    <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
      <span>Tạm tính</span>
      <span class="text-success">{{ formatCurrency(totalPrice) }}</span>
    </div>
    <slot>
      <nuxt-link
        to="/checkout"
        class="btn text-capitalize btn-outline-success w-100"
      >
        Thanh toán
      </nuxt-link>
    </slot>
  </div>
  <OrderModalDiscount
    @close="isShowListDiscount = false"
    v-if="isShowListDiscount"
    :list-discount="listDiscount"
  />
</template>

<script lang="ts" setup>
import type { BaseResponse } from "~/model";
import type { DiscountItem } from "~/model/discount";
import type { TapmedOrder } from "~/model/item/ITemsTapmed";
import { VoucherItem } from "../../model/discount";
const { $appServices } = useNuxtApp();
const { cart } = useCart();
const { globalOrder, prevOrder } = useOrder();

const discountSelected = computed<DiscountItem[]>(() => {
  //@ts-ignore
  return listDiscount.value?.data?.filter((discount) => discount.isValid) || [];
});

const isShowListDiscount = ref(false);

const listVoucher = ref<BaseResponse<VoucherItem>>();
const listDiscount = ref<BaseResponse<DiscountItem>>();

const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => {
    const price = Number(item.gia_nt2) || 0;
    const qty = Number(item.quantity) || 1;
    return total + price * qty;
  }, 0);
});
watch(
  discountSelected,
  () => {
    applyDiscount();
  },
  { deep: true }
);
watch(
  () => cart.value,
  () => {
    getDiscount();
  },
  { deep: true }
);

function buildOrderDetails() {
  return cart.value.map((item) => ({
    ten_vt: item.ten_vt,
    ma_vt: item.ma_vt,
    so_luong: item.quantity || 0,
    gia_nt2: item.gia_nt2 || 0,
    dvt: item.dvt,
  }));
}

async function getDiscount() {
  globalOrder.value.details = buildOrderDetails();
  try {
    const response = await $appServices.discount.caculateDiscount(
      globalOrder.value
    );
    listDiscount.value = response;
    if (response) {
      //@ts-ignore
      listDiscount.value.data?.forEach((discount) => {
        discount.isValid = true;
      });
    }
  } catch (error) {
    console.error("Error calculating discount:", error);
  }
}

async function applyDiscount() {
  globalOrder.value.details = buildOrderDetails();
  globalOrder.value.selectedDiscounts = discountSelected.value;
  try {
    const response = await $appServices.discount.applyDiscount(
      globalOrder.value
    );
    tranformToCart(response.data as TapmedOrder);
  } catch (error) {
    console.error("Error applying discount:", error);
  }
}

async function getVoucher() {
  try {
    const response = await $appServices.discount.getVoucherCode();
    listVoucher.value = response;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
  }
}

async function applyVoucher(code?: string) {
  if (!code) return;
  globalOrder.value.details = buildOrderDetails();
  globalOrder.value.selectedDiscounts = discountSelected.value;
  globalOrder.value.header!.voucher_code = code;
  try {
    const response = await $appServices.discount.applyDiscount(
      globalOrder.value
    );
    tranformToCart(response.data as TapmedOrder);
  } catch (error) {
    console.error("Error applying discount:", error);
  }
}

function tranformToCart(data: TapmedOrder) {
  prevOrder.value = data;
}
onMounted(() => {
  getDiscount();
  getVoucher();
});
</script>

<style></style>
