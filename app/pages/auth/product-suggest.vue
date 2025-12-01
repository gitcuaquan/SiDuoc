<template>
  <LayoutAuth :loading="loading" :breadcrumb="breadcrumb" :is-empty="listProduct?.getData?.length === 0"
    name="Quản lý sản phẩm nổi bật">
    <template #actions>
      <button class="btn btn-primary" @click="showModalDetail = 'new'">
        Thêm sản phẩm nổi bật
      </button>
    </template>
    <div class="cart-header d-none border w-100 d-lg-table-row bg-light fw-semibold">
      <span class="d-lg-table-cell text-nowrap p-3 py-2">Ảnh đại diện</span>
      <span class="d-lg-table-cell p-3 py-2">Tên sản phẩm</span>
      <span class="d-lg-table-cell text-nowrap p-3 py-2">Đơn giá</span>
      <span class="d-lg-table-cell p-3 py-2 text-center text-nowrap">
        Đơn vị tính
      </span>

      <span class="d-lg-table-cell p-3 py-2 text-center text-nowrap">Hành Động
      </span>
    </div>

    <!-- Item -->
    <div v-for="product in listProduct?.getData"
      class="cart-item d-block border w-100 d-lg-table-row align-middle border rounded-3 p-3 mb-3 bg-white shadow-sm">
      <!-- Product -->
      <div
        class="cart-product mb-lg-0 mb-3 d-flex justify-content-between align-items-start gap-3 d-lg-table-cell p-lg-3">
        <span class="d-lg-none fw-semibold">Ảnh đại diện:</span>
        <div class="d-flex flex-column align-items-lg-start">
          <img :src="product.image_urls?.[0]?.url || '/images/image-error.svg'" alt="thumbnail" class="img-thumbnail"
            style="width: 50px; height: auto" />
        </div>
      </div>

      <!-- Price -->
      <div
        class="cart-price w-custom text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3">
        <span class="d-lg-none fw-semibold">Tên sản phẩm:</span>
        <span>{{ product.ten_vt }}</span>
      </div>
      <div
        class="cart-price text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3">
        <span class="d-lg-none fw-semibold">Đơn giá:</span>
        <span>{{ formatCurrency(product.gia_nt2 as number) }}</span>
      </div>
      <!-- Quantity -->
      <div
        class="cart-qty w-custom align-middle d-flex text-lg-center mb-2 mb-lg-0 justify-content-between align-items-center d-lg-table-cell p-lg-3">
        <span class="d-lg-none fw-semibold"> Đơn vị tính:</span>
        <span class="text-lg-center">{{ product.dvt }}</span>
        <!-- <span class="text-lg-center">{{ order.created_by }}</span> -->
      </div>
      <!-- Total -->
      <div
        class="cart-total gap-2 align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-end d-lg-table-cell p-lg-3">
        <div class="d-flex justify-content-end gap-1">
          <button class="btn btn-danger btn-sm" @click="deleteProduct(product)">
            Xoá
          </button>
        </div>
      </div>
    </div>
    <div class="mt-3" v-if="listProduct?.pagination">
      <SharedModulePagination :pagination="listProduct.pagination" @page-change="(page) => {
        queryList.PageIndex = page;
        getProductSuggest();
      }" />
    </div>
  </LayoutAuth>
  <ClientOnly>
    <AuthModalProductSuggest v-if="showModalDetail" @created="getProductSuggest" @close="showModalDetail = null" />
  </ClientOnly>
</template>

<script lang="ts" setup>
  import { BaseResponse, type ITemsTapmed, type ProjectConfig } from "~/model";
  const { $appServices } = useNuxtApp();
  const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
    { label: "Tài khoản", to: "/auth" },
    { label: "Quản lý sản phẩm nổi bật" },
  ]);
  const showModalDetail = ref<string | null>(null);
  const loading = ref(false);
  const listProduct = ref<BaseResponse<ITemsTapmed>>();

  const queryList = ref({
    PageIndex: 1,
    PageSize: 8,
    search: "",
  });

  async function getProductSuggest() {
    try {
      const rsData = await $appServices.items.productSuggest<any>(queryList.value);
      listProduct.value = rsData;
    } catch (error) {
      console.error("Error fetching product suggest:", error);
    }
  }
  function deleteProduct(product: ITemsTapmed) {
    if (confirm("Bạn có chắc chắn xoá sản phẩm nổi bật này không?"))
      $appServices.items.addProductSuggest({
        isDelete: true,
        ma_vt: product.ma_vt,
        list_code: "HOME"
      }).then(() => {
        useToast().success("Xoá sản phẩm nổi bật thành công");
        getProductSuggest();
      }).catch((error) => {
        useToast().error("Xoá sản phẩm nổi bật thất bại");
        console.error("Error deleting product suggest:", error);
      });
  }
  onMounted(() => {
    getProductSuggest();
  });
</script>
<style scoped>
  .sticky-top {
    top: 80px;
    z-index: 0 !important;
  }

  @media screen and (min-width: 992px) {
    .w-custom {
      width: 440px;
    }
  }
</style>
