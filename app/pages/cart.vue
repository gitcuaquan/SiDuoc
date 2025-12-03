<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="container my-4">
    <div class="row" v-if="cart.length > 0">
      <div class="col-lg-8">
        <CartModuleList />
      </div>
      <div class="col-lg-4">
        <CartModuleSummary class="border rounded shadow-sm">
          <button class="btn btn-primary w-100 mt-2" @click="showCheckoutModal = true">
            Xác nhận đơn hàng
          </button>
        </CartModuleSummary>
        <div class="d-flex mt-3 flex-column gap-3">
          <!-- <div v-for="value in 4" :key="value">
            <SharedModuleCoupon />
          </div> -->
        </div>
      </div>
    </div>
    <div v-else class="row justify-content-center">
      <div class="col-4">
        <div class="d-flex flex-column align-items-center">
          <img src="/images/cart-empty.svg" class="w-75" alt="" />
          <h6 class="mt-4 text-muted text-center">
            Giỏ hàng của bạn đang trống
          </h6>
          <NuxtLink to="/quick-order" class="btn btn-link btn-sm mt-3">
            <CornerDownLeft :size="16" :stroke-width="1.5" /> Đặt hàng ngay
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <CheckoutModalCheckOut v-if="showCheckoutModal" @close="showCheckoutModal = false" />
  </ClientOnly>
</template>

<script lang="ts" setup>
  import type { ProjectConfig } from "~/model";

  // SEO Meta Tags for Cart Page
  useSeoMeta({
    title: 'Giỏ hàng | Sỉ Dược',
    description: 'Giỏ hàng của bạn - Xem chi tiết các sản phẩm dược phẩm đã thêm và tiến hành thanh toán.',
    ogTitle: 'Giỏ hàng | Sỉ Dược',
    ogDescription: 'Quản lý giỏ hàng, xem chi tiết sản phẩm và thanh toán đơn hàng của bạn tại Sỉ Dược.',
    ogImage: '/images/final-medial.png',
  })

  const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
    { label: "Giỏ hàng" },
  ]);
  const { cart } = useCart();
  const showCheckoutModal = ref(false);
</script>
