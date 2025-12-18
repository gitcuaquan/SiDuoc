<template>
  <div
    class="cart-summary position-relative bg-white p-2 p-md-3"
    v-bind="$attrs"
  >
    <div
      v-if="loading"
      class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
    >
      <UiLoading />
    </div>
    <h5 class="fw-semibold mb-3">Tổng quan</h5>
    <div class="d-flex justify-content-between mb-2">
      <span>Tổng tiền hàng</span>
      <span>{{
        formatCurrency(prevOrder?.header?.t_tien_nt2 || totalPrice)
      }}</span>
    </div>
    <ui-popover v-if="listVoucher?.getData.length && !isShow" trigger="click">
      <template #trigger>
        <span style="cursor: pointer">
          <Gift :size="16" :stroke-width="1.75" />
          <small>
            Đang có {{ listVoucher?.getData.length }} mã giảm giá có thể áp dụng
            <span class="text-primary fw-bold"> Click để xem </span>
          </small>
        </span>
      </template>
      <template #content>
        <div class="p-2" style="width: 320px">
          <strong>Mã giảm giá có thể áp dụng:</strong>
          <div
            v-for="voucher in listVoucher?.getData"
            :key="voucher.ma_the"
            class="d-flex mb-2 justify-content-between align-items-center w-100 border p-1 rounded"
          >
            <div class="">
              <!-- {{ voucher.tl_ck }} -->
              <small class="fw-semibold">{{ voucher.ten_the }}</small>
              <div class="text-secondary" style="font-size: 12px">
                Mã: {{ voucher.ma_the }}
              </div>
              <div class="text-secondary fw-normal" style="font-size: 12px">
                {{ formatDate(voucher.ngay_ph) }} -
                {{ formatDate(voucher.ngay_hh) }}
              </div>
            </div>
            <div class="d-flex flex-grow-0 flex-column">
              <div class="text-end">
                <button
                  @click="applyVoucher(voucher)"
                  class="btn-sm btn btn-primary mb-1"
                  style="font-size: 12px"
                >
                  Áp dụng
                </button>
              </div>
              <div v-if="voucher.tien_ck" class="text-danger fw-bold">
                - {{ formatCurrency(voucher.tien_ck || 0) }}
              </div>
              <div v-if="voucher.tl_ck" class="text-danger fw-bold">
                - {{ voucher.tl_ck }} %
              </div>
            </div>
          </div>
        </div>
      </template>
    </ui-popover>
    <template v-if="globalOrder.header?.voucher_code">
      <div class="mt-2">Mã giảm giá đã áp dụng :</div>
      <div
        class="d-flex mt-1 badge bg-success bg-opacity-10 text-success gap-1 ps-2 py-2 w-fit-content align-items-center rounded"
      >
        Đã áp dụng mã {{ globalOrder.header?.voucher_code }} được giảm
        <span v-if="!globalOrder.header?.voucher_rate">
          {{
            globalOrder.header?.voucher_discount
              ? formatCurrency(globalOrder.header?.voucher_discount)
              : ""
          }}
        </span>
        <span v-else>
          {{
            globalOrder.header?.voucher_rate
              ? globalOrder.header?.voucher_rate + " %"
              : ""
          }}
        </span>
        <X
          v-if="!isShow"
          :size="14"
          @click="removeVoucher"
          class="ms-auto"
          style="cursor: pointer"
        />
      </div>
    </template>
    <hr />
    <div class="d-flex justify-content-between align-items-start mb-2">
      <div>
        <span>Khuyến mãi </span>
        <span
          class="badge gap-1 ps-0 fw-normal bg-transparent text-muted d-flex align-items-center"
        >
          Đang áp dụng {{ discountSelected.length || 0 }} /
          <b>{{ listDiscount?.getData?.length || 0 }}</b>
          khuyến mãi
        </span>
      </div>
      <a
        role="button"
        v-if="!isShow && (listDiscount?.getData?.length || 0) > 0"
        @click="isShowListDiscount = true"
        class="btn-link text-decoration-none"
      >
        <small>Chọn chương trình</small>
      </a>
    </div>

    <div class="d-flex flex-wrap gap-2">
      <div
        role="button"
        class="badge ps-0 m-0 py-0 text-primary"
        v-for="value in discountSelected"
      >
        <TicketPercent :size="16" :stroke-width="2" /> {{ value.discountName }}
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between mb-3">
      <span>Tổng tiền chiết khấu</span>
      <span class="text-danger">
        - {{ formatCurrency(prevOrder?.header?.tong_ck_don || 0) }}
      </span>
    </div>
    <hr />
    <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
      <span>Tổng</span>
      <span class="text-success">{{
        formatCurrency(prevOrder?.header?.t_tt_nt || totalPrice)
      }}</span>
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

const props = defineProps<{
  isShow?: boolean;
}>();

const discountSelected = computed<DiscountItem[]>(() => {
  //@ts-ignore
  return listDiscount.value?.data?.filter((discount) => discount.isValid) || [];
});

const isShowListDiscount = ref(false);
const loading = ref(false);
const listVoucher = ref<BaseResponse<VoucherItem>>();
const listDiscount = ref<BaseResponse<DiscountItem>>();

const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => {
    const price = Number(item.gia_nt2) || 0;
    const qty = Number(item.quantity) || 1;
    return total + price * qty;
  }, 0);
});

const timeOut = ref<any>(null);

watch(
  discountSelected,
  () => {
    if (timeOut.value) clearTimeout(timeOut.value);
    timeOut.value = setTimeout(() => {
      applyDiscount();
    }, 300);
  },
  { deep: true }
);

watch(
  () => cart.value,
  () => {
    if (timeOut.value) clearTimeout(timeOut.value);
    timeOut.value = setTimeout(() => {
      getDiscount();
    }, 300);
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

function removeVoucher() {
  globalOrder.value.header!.voucher_code = "";
  globalOrder.value.header!.voucher_rate = 0;
  globalOrder.value.header!.voucher_discount = 0;
  applyDiscount();
}

async function getDiscount() {
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
}

async function applyDiscount() {
  loading.value = true;
  globalOrder.value.details = buildOrderDetails();
  globalOrder.value.selectedDiscounts = discountSelected.value;
  try {
    const response = await $appServices.discount.applyDiscount(
      globalOrder.value
    );
    tranformToCart(response.data as TapmedOrder);
  } catch (error) {
    console.error("Error applying discount:", error);
  } finally {
    loading.value = false;
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

async function applyVoucher(data?: VoucherItem) {
  if (!data) return;
  globalOrder.value.details = buildOrderDetails();
  globalOrder.value.selectedDiscounts = discountSelected.value;
  globalOrder.value.header!.voucher_code = data.ma_the;
  if (data.tl_ck) {
    globalOrder.value.header!.voucher_rate = data.tl_ck;
  } else if (data.tien_ck) {
    globalOrder.value.header!.voucher_discount = data.tien_ck;
  }
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
