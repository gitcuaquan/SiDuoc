<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="container mt-3">
    <!-- Main Product Section -->
    <div class="row bg-white pt-3 rounded">
      <!-- Product Images -->
      <div class="col-lg-5 col-md-6">
        <div class="sticky-top" style="top: 50px; z-index: 0">
          <ProductModuleImg :images="detailProduct?.data?.image_urls" />

          <p class="text-muted mt-2 small">
            Màu mã sản phẩm có thể thay đổi theo lô hàng
          </p>
        </div>
      </div>
      <!-- Product Info -->
      <div class="col-lg-7 col-md-6">
        <div class="product-info">
          <!-- Brand -->
          <p class="text-muted mb-2">
            Danh mục: <span class="text-primary fw-bold">{{ detailProduct?.data?.ten_nhthkd || 'Sỉ ' }}</span>
          </p>

          <!-- Product Title -->
          <h1 class="h3 fw-bold mb-3 text-dark">
            {{ detailProduct?.data?.ten_vt || "Tên sản phẩm không xác định" }}
          </h1>

          <!-- Rating and Reviews -->
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="text-muted me-2"
              >Mã sản phẩm:
              <b>{{ detailProduct?.data?.ma_vt || "00000000" }}</b></span
            >
            <!-- <div class="me-3 d-flex gap-1 align-items-center">
              <Star :size="16" class="text-warning" :stroke-width="1" />
              <span class="fw-bold">5</span>
            </div> -->
            <!-- <span class="text-muted me-3">5 đánh giá</span>
            <span class="text-muted">21 bình luận</span> -->
          </div>

          <!-- Price -->
          <div class="price-section mb-4">
            <div class="d-flex align-items-center mb-2">
              <h2 class="h2 text-primary fw-bold mb-0 me-3">
                {{
                  (detailProduct?.data?.gia_nt2 || 0) > 0
                    ? formatCurrency(detailProduct?.data?.gia_nt2 || 0)
                    : "Liên hệ"
                }}
              </h2>
              <span
                v-if="(detailProduct?.data?.gia_nt2 || 0) > 0"
                class="text-muted"
                >/ {{ detailProduct?.data?.dvt || "đơn vị" }}
              </span>
            </div>
            <p
              v-if="detailProduct?.data?.gia2"
              class="text-muted text-decoration-line-through mb-3"
            >
              {{ formatCurrency(detailProduct?.data?.gia2 || 0) }}
            </p>
          </div>
          <div id="action" class="row mt-3 bg-white align-items-end pb-3 g-3">
            <div class="col-md-3">
              <label class="form-label fw-bold">Số lượng</label>
              <br />
              <UiBtnGroup v-model="quantity" />
            </div>
            <div class="col-md-6">
              <button @click="addToCartPage" id="add-to-cart" class="btn btn-primary px-5">
                Thêm vào giỏ hàng <ShoppingBag />
              </button>
            </div>
          </div>
          <div class="ingredients-section">
            <h6 class="fw-bold mb-3">Mô tả sản phẩm</h6>
            <p class="small text-muted line-break-container">
              {{ detailProduct?.data?.mo_ta_san_pham }}
            </p>
          </div>
          <!-- Product Details Table -->
          <div class="table-responsive my-3">
            <table class="table table-borderless">
              <tbody>
                <tr>
                  <td class="text-muted py-2" style="width: 200px">
                    Đơn vị tính
                  </td>
                  <td class="py-2">
                    {{ detailProduct?.data?.dvt }}
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Thành phần</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.thanh_phan }}
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Công dụng</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.cong_dung }}
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Cách dùng</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.cach_dung }}
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Tác dụng phụ</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.tac_dung_phu }}
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Bảo quản</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.bao_quan }}
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Lưu ý</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.luu_y }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- End Main Product Section -->
    <h5 class="mt-5 text-capitalize">Sản phẩm liên quan</h5>
    <ProductModuleSliderItem />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProjectConfig } from "~/model";
const { $appServices } = useNuxtApp();
const { addToCart } = useCart();
const route = useRoute();
const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Đặt hàng nhanh", to: "/quick-order" },
  { label: "Thần kinh não" },
]);

const quantity = ref(1);

// reactive slug and data fetch: ensure refetch when route param changes
const slug = computed(() => route.params.slug as string);

const { data: detailProduct, error } = await useAsyncData(
  () => `product-details-${slug.value}`,
  async () => {
    return await $appServices.items.getItemById(slug.value);
  },
  { watch: [slug] }
);

// 🧠 Reactive useHead — sẽ tự update khi detailProduct.value đổi
useSeoMeta({
  title: detailProduct?.value?.data?.ten_vt || "Tên sản phẩm",
  ogTitle: detailProduct?.value?.data?.ten_vt || "Tên sản phẩm",
  description:
    detailProduct?.value?.data?.mo_ta_san_pham || "Chi tiết sản phẩm",
  ogImage:
    detailProduct?.value?.data?.image_urls?.[0]?.url ||
    "/images/image-error.svg",
  ogDescription:
    detailProduct?.value?.data?.mo_ta_san_pham || "Chi tiết sản phẩm",
  keywords: detailProduct?.value?.data?.ten_vt
    ? detailProduct.value.data.ten_vt.split(" ").join(", ")
    : "sản phẩm",
  author: "Sỉ Dược",
});

function addToCartPage() {
  if (!detailProduct?.value?.data) return;
  detailProduct.value.data.quantity = quantity.value;
  addToCart(detailProduct.value.data);
  useToast().success("Đã thêm vào giỏ hàng");
}
</script>

<style scoped>
.price-section .h2 {
  font-size: 2.5rem;
}

.badge.bg-danger {
  background: linear-gradient(45deg, #dc3545, #ff6b7a) !important;
}

.table td {
  border: none;
  padding: 0.75rem 0.5rem;
}

.table tr:not(:last-child) {
  border-bottom: 1px solid #f8f9fa;
}

.ingredients-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid var(--bs-primary);
}

@media (max-width: 768px) {
  .price-section .h2 {
    font-size: 2rem;
  }

  .table-responsive {
    font-size: 0.9rem;
  }
  #add-to-cart {
    width: 100%;
  }
}
/* Hide number input arrows for Chrome, Safari, Edge, Opera */
.input-number::-webkit-outer-spin-button,
.input-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide number input arrows for Firefox */
.input-number[type="number"] {
  -moz-appearance: textfield;
}
.input-number {
  width: 45px;
}
.small {
  font-size: 0.875rem;
}
.line-break-container {
  white-space: pre-line;
}
</style>
