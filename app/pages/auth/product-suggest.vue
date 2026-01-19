<template>
  <LayoutAuth :loading="loading" :breadcrumb="breadcrumb" :is-empty="false" name="Quản lý sản phẩm">
    <template #actions>
      <button class="btn btn-primary" @click="showModalDetail = 'new'">
        Thêm sản phẩm
      </button>
    </template>

    <div class="row">
      <!-- Table 1: HOME -->
      <div class="col-12 mb-4">
        <h5 class="mb-3 text-primary fw-bold">Sản phẩm nổi bật</h5>
        <div class="table-responsive">
          <table class="table table-sm table-bordered align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="text-center text-nowrap p-3" style="width: 50px">Ảnh</th>
                <th class="text-nowrap p-3">Tên sản phẩm</th>
                <th class="text-end text-nowrap p-3">Đơn giá</th>
                <th class="text-center text-nowrap p-3" style="width: 120px">
                  Đơn vị tính
                </th>
                <th class="text-center text-nowrap p-3" style="width: 100px">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in listProductHome?.getData" :key="product.ma_vt">
                <td class="text-center p-2">
                  <img :src="product.image_urls?.[0]?.url || '/images/image-error.svg'" alt="thumbnail"
                    class="img-thumbnail" style="width: 40px; height: 40px; object-fit: cover" />
                </td>
                <td class="p-3">
                  {{ product.ten_vt }}
                </td>
                <td class="text-end p-3">
                  {{ formatCurrency(product.gia_nt2 as number) }}
                </td>
                <td class="text-center p-3">
                  {{ product.dvt }}
                </td>
                <td class="text-center p-3">
                  <button class="btn btn-outline-danger btn-sm" @click="deleteProduct(product, 'HOME')">
                    <Trash2 :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="!listProductHome?.getData?.length">
                <td colspan="5" class="text-center py-5 text-muted">
                  Chưa có dữ liệu sản phẩm nổi bật
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3" v-if="listProductHome?.pagination">
          <SharedModulePagination :pagination="listProductHome.pagination" @page-change="(page) => {
            queryListHome.PageIndex = page;
            getProductSuggest('HOME');
          }" />
        </div>
      </div>

      <!-- Table 2: TopProduct -->
      <div class="col-12">
        <h5 class="mb-3 text-primary fw-bold">Sản phẩm ưu tiên</h5>
        <div class="table-responsive">
          <table class="table table-sm table-bordered align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="text-center text-nowrap p-3" style="width: 50px">Ảnh</th>
                <th class="text-nowrap p-3">Tên sản phẩm</th>
                <th class="text-end text-nowrap p-3">Đơn giá</th>
                <th class="text-center text-nowrap p-3" style="width: 120px">
                  Đơn vị tính
                </th>
                <th class="text-center text-nowrap p-3" style="width: 100px">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in listProductTop?.getData" :key="product.ma_vt">
                <td class="text-center p-2">
                  <img :src="product.image_urls?.[0]?.url || '/images/image-error.svg'" alt="thumbnail"
                    class="img-thumbnail" style="width: 40px; height: 40px; object-fit: cover" />
                </td>
                <td class="p-3">
                  {{ product.ten_vt }}
                </td>
                <td class="text-end p-3">
                  {{ formatCurrency(product.gia_nt2 as number) }}
                </td>
                <td class="text-center p-3">
                  {{ product.dvt }}
                </td>
                <td class="text-center p-3">
                  <button class="btn btn-outline-danger btn-sm" @click="deleteProduct(product, 'TopProduct')">
                    <Trash2 :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="!listProductTop?.getData?.length">
                <td colspan="5" class="text-center py-5 text-muted">
                  Chưa có dữ liệu sản phẩm ưu tiên
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3" v-if="listProductTop?.pagination">
          <SharedModulePagination :pagination="listProductTop.pagination" @page-change="(page) => {
            queryListTop.PageIndex = page;
            getProductSuggest('TopProduct');
          }" />
        </div>
      </div>
    </div>
  </LayoutAuth>
  <ClientOnly>
    <AuthModalProductSuggest v-if="showModalDetail" @created="refreshAll" @close="showModalDetail = null" />
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
const listProductHome = ref<BaseResponse<ITemsTapmed>>();
const listProductTop = ref<BaseResponse<ITemsTapmed>>();

const queryListHome = ref({
  PageIndex: 1,
  PageSize: 8,
  search: "",
  list_code: "HOME"
});

const queryListTop = ref({
  PageIndex: 1,
  PageSize: 8,
  search: "",
  list_code: "TopProduct"
});

async function getProductSuggest(type: 'HOME' | 'TopProduct') {
  try {
    if (type === 'HOME') {
      const rsData = await $appServices.items.productSuggest<any>(queryListHome.value);
      listProductHome.value = rsData;
    } else {
      const rsData = await $appServices.items.productSuggest<any>(queryListTop.value);
      listProductTop.value = rsData;
    }
  } catch (error) {
    console.error("Error fetching product suggest:", error);
  }
}

function deleteProduct(product: ITemsTapmed, type: 'HOME' | 'TopProduct') {
  const label = type === 'HOME' ? 'nổi bật' : 'ưu tiên';
  if (confirm(`Bạn có chắc chắn xoá sản phẩm ${label} này không?`))
    $appServices.items.addProductSuggest({
      isDelete: true,
      ma_vt: product.ma_vt,
      list_code: type || "HOME"
    }).then(() => {
      useToast().success(`Xoá sản phẩm ${label} thành công`);
      getProductSuggest(type);
    }).catch((error) => {
      useToast().error(`Xoá sản phẩm ${label} thất bại`);
      console.error("Error deleting product suggest:", error);
    });
}

function refreshAll() {
  getProductSuggest("HOME");
  getProductSuggest("TopProduct");
}

onMounted(() => {
  refreshAll();
});
</script>
