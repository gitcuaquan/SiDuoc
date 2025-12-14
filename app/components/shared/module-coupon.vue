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
    <!-- {{ coupon.itemNameBuy }} -->
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
      <div style="font-size: 13px" class="m-0 fw-bold pe-2">
        {{ coupon.discountName }}
      </div>
      <span class="line-clamp mt-1" v-if="coupon.itemNameBuy" style="font-size: 11px">
        Mua {{ coupon.itemNameBuy }}
      </span>
      <span class="line-clamp mt-1" v-else style="font-size: 11px">
        Đơn hàng đủ điều kiện
      </span>
      <div class="d-flex flex-column gap-1">
        <!-- Gift / Voucher -->
        <template v-if="coupon.itemNameGift?.trim()">
          <small class="text-small text-muted">
            Tặng thêm <b>{{ coupon.quantityGift || 0 }}</b> sản phẩm
            {{ coupon.itemNameGift }}
          </small>
        </template>

        <!-- Discount type D (percent / per-item / total / fixed-price) -->
        <template v-if="coupon?.discountType?.trim()?.toUpperCase() === 'D'">
          <small v-if="coupon.discountRate" class="text-small text-muted">
            Giảm {{ coupon.discountRate }} % trên mỗi mặt hàng
          </small>

          <small v-if="coupon.discountAmount" class="text-small text-muted">
            Giảm tiền trên từng mặt hàng tổng cộng
            {{ formatCurrency(coupon.discountAmount) }}
          </small>

          <small v-if="coupon.moneyVoucher" class="text-small text-muted">
            Tất cả sản phẩm được đồng giá
            {{ formatCurrency(coupon.moneyVoucher) }}
          </small>

          <small v-if="coupon.totalDiscount" class="text-small text-muted">
            Đã được giảm {{ formatCurrency(coupon.totalDiscount) }}
          </small>
        </template>

        <!-- Discount type M (money off total order) -->
        <template v-if="coupon?.discountType?.trim()?.toUpperCase() === 'M'">
          <small v-if="coupon.totalDiscount" class="text-small text-muted">
            Giảm {{ formatCurrency(coupon.totalDiscount || 0) }} cho tổng giá
            trị đơn hàng
          </small>
        </template>

        <!-- Max discount info -->
        <small v-if="coupon.maxDiscount" class="text-small text-secondary">
          (tối đa {{ formatCurrency(coupon.maxDiscount || 0) }})
        </small>
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
.text-small {
  font-size: 11px;
}
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp:1;
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
