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
          </div>
          <p class="text-muted mb-2">
            Nhóm thuốc:
            <span class="text-primary fw-bold">
              {{ detailProduct?.data?.ten_nhthkd || "Chưa xác định" }}</span
            >
          </p>
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
                >/
                {{ detailProduct?.data?.dvt || "đơn vị" }}
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
              <UiBtnGroup
                v-model="quantity"
                :max="
                  (detailProduct?.data?.sl_toi_da || 0) == 0
                    ? 9999999
                    : detailProduct?.data?.sl_toi_da
                "
              />
            </div>
            <div class="col-md-6">
              <button
                @click="addToCartPage"
                id="add-to-cart"
                class="btn btn-primary px-5"
              >
                Thêm vào giỏ hàng
                <ShoppingBag />
              </button>
            </div>
          </div>
          <div class="ingredients-section">
            <h6 class="fw-bold mb-3">Mô tả sản phẩm</h6>
            <p class="small m-0 text-muted line-break-container">
              {{ detailProduct?.data?.mo_ta_san_pham || "Chưa cập nhật dữ liệu" }}
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
                    <!-- <small
                      class="text-muted fst-italic"
                      v-if="!detailProduct?.data?.thanh_phan"
                      >Chưa cập nhật dữ liệu</small
                    > -->
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Công dụng</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.cong_dung }}
                    <!-- <small
                      class="text-muted fst-italic"
                      v-if="!detailProduct?.data?.cong_dung"
                      >Chưa cập nhật dữ liệu</small
                    > -->
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Cách dùng</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.cach_dung }}
                    <!-- <small
                      class="text-muted fst-italic"
                      v-if="!detailProduct?.data?.cach_dung"
                      >Chưa cập nhật dữ liệu</small
                    > -->
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Tác dụng phụ</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.tac_dung_phu }}
                    <!-- <small
                      class="text-muted fst-italic"
                      v-if="!detailProduct?.data?.tac_dung_phu"
                      >Chưa cập nhật dữ liệu</small
                    > -->
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Bảo quản</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.bao_quan }}

                    <!-- <small
                      class="text-muted fst-italic"
                      v-if="!detailProduct?.data?.bao_quan"
                      >Chưa cập nhật dữ liệu</small
                    > -->
                  </td>
                </tr>
                <tr>
                  <td class="text-muted py-2">Lưu ý</td>
                  <td class="py-2 line-break-container">
                    {{ detailProduct?.data?.luu_y }}
                    <!-- <small
                      class="text-muted fst-italic"
                      v-if="!detailProduct?.data?.luu_y"
                      >Chưa cập nhật dữ liệu</small
                    > -->
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
const { addToCart, getQtyById } = useCart();
const route = useRoute();
const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Đặt hàng nhanh", to: "/quick-order" },
  { label: "Thần kinh não" },
]);
const { isAuthenticated, togglePopupLogin } = useAuth();

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

function addToCartPage() {
  if (!detailProduct?.value?.data) return;
  if (!isAuthenticated.value) {
    useToast().error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
    togglePopupLogin();
    return;
  }

  const maxQty = detailProduct.value.data.sl_toi_da || 0;
  const existingQty = getQtyById(detailProduct.value.data.ma_vt);

  // Nếu đã đạt trần trong giỏ thì dừng
  if (maxQty > 0 && existingQty >= maxQty) {
    quantity.value = 0;
    useToast().error(`Số lượng tối đa cho sản phẩm này là ${maxQty}. Bạn đã đạt mức tối đa trong giỏ.`);
    return;
  }

  const desiredQty = quantity.value + (existingQty || 0);
  const finalQty = maxQty > 0 ? Math.min(desiredQty, maxQty) : desiredQty;

  // Cập nhật input để người dùng thấy số còn lại có thể đặt
  if (maxQty > 0 && desiredQty > maxQty) {
    quantity.value = Math.max(0, maxQty - (existingQty || 0));
    useToast().error(`Số lượng tối đa cho sản phẩm này là ${maxQty}. Đã đặt về mức tối đa.`);
  } else {
    useToast().success("Đã thêm vào giỏ hàng");
  }

  detailProduct.value.data.quantity = finalQty;
  addToCart(detailProduct.value.data);
}

// SEO Meta Tags - Dynamic for Product Detail Page
useSeoMeta({
  title: () => `${detailProduct?.value?.data?.ten_vt || "Sản phẩm"} | Sỉ Dược`,
  ogTitle: () => detailProduct?.value?.data?.ten_vt || "Sản phẩm",
  description: () =>
    detailProduct?.value?.data?.mo_ta_san_pham ||
    "Chi tiết sản phẩm dược phẩm từ Sỉ Dược",
  ogImage: () =>
    detailProduct?.value?.data?.image_urls?.[0]?.url ||
    "/images/final-medial.png",
  ogImageAlt: () => detailProduct?.value?.data?.ten_vt || "Sản phẩm",
  ogDescription: () =>
    detailProduct?.value?.data?.mo_ta_san_pham || "Chi tiết sản phẩm dược phẩm",
  keywords: () =>
    detailProduct?.value?.data?.ten_vt
      ? `${detailProduct.value.data.ten_vt}, dược phẩm, vitamin, sỉ dược`
      : "dược phẩm, vitamin, sỉ dược",
  author: "Sỉ Dược",
});
// Schema.org Product Structured Data
useSchemaOrg({
  type: "Product",
  name: detailProduct?.value?.data?.ten_vt || "Sản phẩm",
  description:
    detailProduct?.value?.data?.cong_dung || "Chi tiết sản phẩm dược phẩm",
  image:
    detailProduct?.value?.data?.image_urls?.[0]?.url ||
    "/images/final-medial.png",
  sku: detailProduct?.value?.data?.ma_vt || "00000000",
  brand: {
    "@type": "Brand",
    name: "Sỉ Dược",
  },
  category: "Dược phẩm",
  manufacturer: {
    "@type": "Organization",
    name: "Sỉ Dược",
  },
  offers: {
    "@type": "Offer",
    price: detailProduct?.value?.data?.gia_nt2 || 0,
    priceCurrency: "VND",
    availability: "https://schema.org/OutOfStock",
  },
});
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
