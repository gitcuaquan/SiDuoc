<template>
  <div class="cart-summary position-relative bg-white p-2 p-md-3" v-bind="$attrs">
    <h5 class="fw-semibold mb-3">{{ title || 'Tổng quan' }}</h5>

    <div class="d-flex justify-content-between mb-2">
      <span>Tổng tiền hàng</span>
      <span>{{ formatCurrency(totalPrice) }}</span>
    </div>

    <div v-if="voucherCount" class="mb-2">
      <small class="text-muted">Đang có {{ voucherCount }} mã giảm giá có thể áp dụng</small>
    </div>

    <div v-if="voucherCode" class="mt-2">
      <div class="d-flex mt-1 badge bg-success bg-opacity-10 text-success gap-1 ps-2 py-2 w-fit-content align-items-center rounded">
        Đã áp dụng mã {{ voucherCode }}
        <span v-if="!voucherRate">{{ voucherDiscount ? formatCurrency(voucherDiscount) : '' }}</span>
        <span v-else>{{ voucherRate ? voucherRate + ' %' : '' }}</span>
      </div>
    </div>

    <hr />

    <div class="d-flex justify-content-between align-items-start mb-2">
      <div>
        <span>Khuyến mãi đã áp dụng</span>
      </div>
    </div>

    <div class="d-flex flex-wrap gap-2 mb-2">
      <div role="button" class="badge ps-0 m-0 py-0 text-primary" v-for="(value, i) in discountSelected || []" :key="i">
      <TicketPercent :size="16" :stroke-width="2" />  {{ value.discountName }}
      </div>
    </div>

    <hr />
    <div class="d-flex justify-content-between mb-3">
      <span>Tổng tiền chiết khấu</span>
      <span class="text-danger"> - {{ formatCurrency(totalDiscount) }}</span>
    </div>

    <hr />
    <div class="d-flex justify-content-between fw-bold fs-5 mb-3">
      <span>Tổng</span>
      <span class="text-success">{{ formatCurrency(finalTotal) }}</span>
    </div>

    <slot>
      <nuxt-link to="/checkout" class="btn text-capitalize btn-outline-success w-100">Thanh toán</nuxt-link>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  totalPrice?: number
  totalDiscount?: number
  finalTotal?: number
  voucherCode?: string
  voucherRate?: number
  voucherDiscount?: number
  discountSelected?: Array<{ discountName?: string }>
  voucherCount?: number
}>()

const totalPrice = computed(() => Number(props.totalPrice || 0))
const totalDiscount = computed(() => Number(props.totalDiscount || 0))
const finalTotal = computed(() => Number(props.finalTotal ?? props.totalPrice ?? 0))
const voucherCode = computed(() => props.voucherCode || '')
const voucherRate = computed(() => props.voucherRate || 0)
const voucherDiscount = computed(() => props.voucherDiscount || 0)
const discountSelected = computed(() => props.discountSelected || [])
const voucherCount = computed(() => props.voucherCount || 0)

function formatCurrency(value: number | string | undefined) {
  const v = Number(value || 0)
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
}
</script>

<style scoped>
.cart-summary .w-fit-content { display: inline-flex }
</style>
