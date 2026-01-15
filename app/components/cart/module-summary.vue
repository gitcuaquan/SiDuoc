<template>
  <div class="cart-summary position-relative bg-white p-2 p-md-3" v-bind="$attrs">
    <div v-if="loading" style="z-index: 9999999; backdrop-filter: blur(2px)"
      class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
      <UiLoading />
    </div>
    <!-- <h5 class="fw-semibold mb-3">Tổng quan</h5> -->
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
          <div v-for="voucher in listVoucher?.getData" :key="voucher.ma_the"
            class="d-flex mb-2 justify-content-between align-items-center w-100 border p-1 rounded">
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
                <button @click="applyVoucher(voucher)" class="btn-sm btn btn-primary mb-1" style="font-size: 12px">
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
        class="d-flex mt-1 badge bg-success bg-opacity-10 text-success gap-1 ps-2 py-2 w-fit-content align-items-center rounded">
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
        <X v-if="!isShow" :size="14" @click="removeVoucher" class="ms-auto" style="cursor: pointer" />
      </div>
    </template>
    <div v-if="listDiscount?.getData.length" class="d-flex justify-content-between align-items-center mb-2">
      <span class="fw-bold">Khuyến mãi </span>
      <span class="badge gap-1 ps-0 fw-normal bg-transparent text-muted d-flex align-items-center">
        Đang áp dụng {{ discountSelected.length || 0 }} /
        <b>{{ listDiscount?.getData?.length || 0 }}</b>
        khuyến mãi
      </span>

      <!-- <a
        role="button"
        v-if="!isShow && (listDiscount?.getData?.length || 0) > 0"
        @click="isShowListDiscount = true"
        class="btn-link text-decoration-none"
      >
        <small>Chọn chương trình</small>
      </a> -->
    </div>

    <div class="d-flex flex-wrap gap-1 cupon-list" v-if="listDiscount?.getData.length">
      <template v-for="value in listDiscount?.getData">
        <SharedModuleCoupon :coupon="(value as DiscountItem)" />
      </template>
    </div>
    <div class="d-flex justify-content-center flex-column align-items-center" v-else>
      <UiEmpty class="w-50" />
      <small class="text-muted mt-2">Chưa tìm thấy khuyến mãi phù hợp</small>
    </div>
    <hr />
    <div class="d-flex justify-content-between mb-2">
      <span>Tổng tiền hàng</span>
      <span class="fw-bold">{{
        formatCurrency(prevOrder?.header?.t_tien_nt2 || totalPrice)
      }}</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <span>Tổng tiền chiết khấu</span>
      <span class="text-danger">
        - {{ formatCurrency(prevOrder?.header?.tong_ck_don || 0) }}
      </span>
    </div>
    <hr />
    <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
      <span>Tổng thanh toán</span>
      <span class="text-success">{{
        formatCurrency(prevOrder?.header?.t_tt_nt || totalPrice)
      }}</span>
    </div>
    <slot>
      <nuxt-link to="/checkout" class="btn text-capitalize btn-outline-success w-100">
        Thanh toán
      </nuxt-link>
    </slot>
  </div>
  <OrderModalDiscount @close="isShowListDiscount = false" v-if="isShowListDiscount" :list-discount="listDiscount" />
</template>

<script lang="ts" setup>
  import type { BaseResponse } from "~/model";
  import type { DiscountItem } from "~/model/discount";
  import type { TapmedOrder } from "~/model/item/ITemsTapmed";
  import { VoucherItem } from "../../model/discount";
  const { $appServices } = useNuxtApp();
  const { cart } = useCart();
  const { globalOrder, prevOrder, discountManager } = useOrder();

  const props = defineProps<{
    isShow?: boolean;
  }>();

  const discountSelected = computed<DiscountItem[]>(() => {
    const data =
      //@ts-ignore
      listDiscount.value?.data?.filter((discount) => discount.isValid) || [];
    return data;
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
    () => listDiscount.value,
    () => {
      if (!props.isShow) {
        discountManager.value = listDiscount.value?.data || [];
      }
    },
    { deep: true }
  );

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
      if (response) {
        console.log("Discount response:", discountManager.value);
        response.getData.forEach((discount: DiscountItem) => {
          const existing = discountManager.value.find(
            (d: DiscountItem) =>
              d.codeDiscount?.trim() === discount.codeDiscount?.trim()
          );
          discount.isValid = existing ? existing.isValid : true;
        });
        listDiscount.value = response;
      }
    } catch (error) {
      console.error("Error calculating discount:", error);
    } finally {
      loading.value = false;
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
      useToast().error("Lỗi áp dụng khuyến mãi");
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

<style scoped>
  .cupon-list {
    padding: 15px 2px;
    max-height: 210px;
    overflow-y: auto;
    -webkit-mask-image: linear-gradient(to bottom,
        transparent 0%,
        black 12%,
        black 88%,
        transparent 100%);

    mask-image: linear-gradient(to bottom,
        transparent 0%,
        black 12%,
        black 88%,
        transparent 100%);
    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }

  /* Chrome, Edge, Safari */
  .cupon-list::-webkit-scrollbar {
    width: 6px;
    /* thu nhỏ scrollbar */
  }

  .cupon-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .cupon-list::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    /* màu nhạt */
    border-radius: 6px;
  }

  .cupon-list::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }

  /* BỎ mũi tên scrollbar */
  .cupon-list::-webkit-scrollbar-button {
    display: none;
  }
</style>
