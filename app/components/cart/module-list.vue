<template>
  <div class="cart w-100">
    <!-- Header (desktop only) -->
    <div class="cart-header d-none border d-lg-table-row bg-light fw-semibold">
      <span class="d-lg-table-cell p-3 py-2">Sản phẩm</span>
      <span class="d-lg-table-cell p-3 py-2 text-center">Đơn giá</span>
      <span class="d-lg-table-cell p-3 py-2 text-nowrap text-center"
        >Số lượng</span
      >
      <span class="d-lg-table-cell p-3 py-2 text-end">Tổng</span>
      <span
        v-if="!props.isShow"
        class="d-lg-table-cell p-3 py-2 text-end"
      ></span>
    </div>

    <!-- Item -->
    <div
      v-for="item in cart"
      class="cart-item d-block d-lg-table-row border rounded-3 p-3 bg-white shadow-sm"
    >
      <!-- Product -->
      <div
        class="cart-product mb-lg-0 mb-2 d-flex align-items-center gap-3 d-lg-table-cell p-lg-3"
      >
        <div class="d-flex gap-2">
          <img
            :src="item.image_urls?.[0]?.url || '/images/image-error.svg'"
            width="70"
            height="70"
            class="rounded border"
            alt="Sản phẩm"
          />
          <div class="d-flex flex-column">
            <small class="fw-medium ms-2">
              {{ item.ten_vt }}
            </small>
            <div>
              <div
                class="badge fw-normal bg-info border border-info text-dark bg-opacity-10 rounded-pill d-inline-block mt-2"
              >
                <Gift :size="16" />
                <UiPopover>
                  <template #trigger>
                    <span class="ms-1 lh-sm"
                      >Quà tặng 1 bộ dụng cụ nhà bếp</span
                    >
                  </template>
                  <template #content>
                    <div class="p-2" style="max-width: 200px">
                      <strong>Quà tặng:</strong>
                      <p class="mb-0">
                        Bộ dụng cụ nhà bếp bao gồm: 1 dao, 1 thớt, 1 muỗng canh,
                        1 nĩa.
                      </p>
                    </div>
                  </template>
                </UiPopover>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Price -->
      <div
        class="cart-price text-lg-end d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
      >
        <span class="d-lg-none fw-semibold">Đơn giá:</span>
        <span v-if="item.gia_nt2 > 0" class="text-lg-center">{{
          formatCurrency(item.gia_nt2)
        }}</span>
        <span v-else class="text-lg-center"> Liên hệ </span>
      </div>

      <!-- Quantity -->
      <div
        class="cart-qty d-flex text-lg-center mb-2 mb-lg-0 justify-content-between align-items-center d-lg-table-cell p-lg-3"
      >
        <span class="d-lg-none fw-semibold">Số lượng:</span>
        <UiBtnGroup size="sm" v-model="item.quantity" v-if="!props.isShow" />
        <div v-else>{{ item.quantity }} {{ item.dvt }}</div>
      </div>

      <!-- Total -->
      <div
        class="cart-total d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
      >
        <span class="d-lg-none fw-semibold">Tổng:</span>
        <span v-if="item.gia_nt2 > 0" class="text-lg-center">
          {{ formatCurrency(item.gia_nt2 * (item.quantity || 0)) }}
        </span>
        <span v-else class="text-lg-center"> Liên hệ </span>
      </div>
      <div
        v-if="!props.isShow"
        class="cart-total d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
      >
        <span class="d-lg-none fw-semibold">Tổng:</span>
        <span class="text-lg-center">
          <Trash2
            :size="16"
            :stroke-width="1"
            @click="removeFromCart(item.ma_vt)"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { cart, removeFromCart } = useCart();
const props = defineProps<{
  isShow?: boolean;
}>();
</script>

<style scoped>
/* Mobile: card layout */
.cart {
  display: grid;
  gap: 1rem;
}

.cart-header {
  display: none;
}

.cart-item {
  display: grid;
  gap: 0.75rem;
}

/* Desktop: table layout */
@media (min-width: 992px) {
  .cart {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }

  .cart-header {
    display: table-row;
  }

  .cart-header span,
  .cart-item > * {
    display: table-cell;
    vertical-align: middle;
    border-bottom: 1px solid #dee2e6;
  }

  .cart-item {
    display: table-row;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
  }
}
</style>
