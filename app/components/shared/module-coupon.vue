<template>
  <div
    v-if="coupon"
    role="button"
    :class="[
      'd-flex h-100 w-100 align-self-stretch gap-1',
      {
        'coupon-grayscale': coupon && !coupon.isValid,
        'coupon-active': coupon && coupon.isValid,
      },
    ]"
    @click="coupon.isValid = !coupon.isValid"
  >
    <div
      class="bg-primary d-flex align-items-center rounded-1 px-1 bg-opacity-10"
    >
      <div class="ratio ratio-1x1" style="width: 70px">
        <img src="/images/coupon.svg" alt="coupon" />
      </div>
    </div>
    <div
      class="bg-primary flex-grow-1 p-2 rounded-1 bg-opacity-10 position-relative"
    >
      <div class="position-absolute top-0 end-0 me-1 mt-1">
        <input
          type="checkbox"
          class="form-check-input"
          v-model="coupon.isValid"
        />
      </div>
      <div style="font-size: 14px" class="m-0 fw-bold pe-2">
        {{ coupon.discountName }}
      </div>
      <span class="line-clamp" style="font-size: 11px">
        Sản phẩm: {{ coupon.itemNameBuy || "tất cả sản phẩm" }}
      </span>
      <div class="d-flex justify-content-between align-items-center">
        <template v-if="coupon?.discountType?.toUpperCase() === 'M'">
          <div
            v-if="coupon.totalDiscount"
            style="font-size: 11px"
            class="text-secondary"
          >
            Giảm {{ formatCurrency(coupon.totalDiscount || 0) }} cho tổng giá
            trị đơn hàng
          </div>
        </template>
        <template v-if="coupon?.discountType?.toUpperCase() === 'D'">
          <div style="font-size: 11px" class="text-secondary">
            <span v-if="coupon.discountRate">
              Giảm {{ coupon.discountRate }} %
            </span>
            <span v-if="coupon.totalDiscount">
              Giảm {{ formatCurrency(coupon.totalDiscount || 0) }}
            </span>
            <span v-if="coupon.moneyVoucher">
              Đồng giá {{ formatCurrency(coupon.moneyVoucher || 0) }}
            </span>
            cho mỗi mặt hàng
          </div>
        </template>
        <template v-if="coupon?.discountType?.toUpperCase() === 'H'">
          <div
            v-if="!coupon.quantityGift && coupon.itemNameGift"
            style="font-size: 11px"
            class="text-secondary"
          >
            Tặng thêm mã voucher <b>{{ coupon.itemNameGift || 0 }}</b>
          </div>
          <div v-else style="font-size: 11px" class="text-secondary">
            Tặng thêm <b> {{ coupon.quantityGift || 0 }} </b>
            {{ coupon.itemNameGift || "Vật tư " }}
          </div>
        </template>
        <div
          v-if="coupon.maxDiscount"
          style="font-size: 11px"
          class="text-secondary"
        >
          (  tối đa {{ formatCurrency(coupon.maxDiscount || 0) }})
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from "vue";
import { type DiscountItem } from "~/model/discount";

const props = defineProps({
  coupon: {
    type: Object as PropType<DiscountItem>,
    required: false,
  },
});
</script>

<style scoped>
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  position: relative;
  line-height: 1.4 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 !important;
}

/* Desaturate when coupon is not valid */
.coupon-grayscale {
  -webkit-filter: grayscale(100%) saturate(0%);
  filter: grayscale(100%) saturate(0%);
  opacity: 0.9;
  transition: filter 160ms ease, opacity 160ms ease, box-shadow 160ms ease,
    border-color 160ms ease;
}

/* Active (valid) coupon: stronger color, subtle border and shadow to emphasize */
.coupon-active {
  filter: none;
  opacity: 1;
  transition: filter 160ms ease, opacity 160ms ease, box-shadow 200ms ease,
    border-color 200ms ease;
  /* border: 1px solid rgba(11,92,215,0.16); */
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(11, 92, 215, 0.06);
}

.coupon-active .bg-primary {
  -webkit-filter: saturate(140%);
  filter: saturate(140%);
  /* background-color: rgba(13,110,253,0.14) !important; */
}
</style>
