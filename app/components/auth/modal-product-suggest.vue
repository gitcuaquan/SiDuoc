<template>
  <div class="modal fade" id="modal-news" tabindex="-1">
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Thêm sản phẩm đề xuất</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <input
            type="search"
            class="form-control mb-3"
            placeholder="Tìm kiếm sản phẩm..."
            v-model="keyword"
          />
          <table class="table align-middle table-sm">
            <thead>
              <tr>
                <th scope="col" class="text-nowrap">Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="value in listProduct?.getData" :key="value.ma_vt">
                <td>
                  <img
                    :src="
                      value.image_urls?.[0]?.url || '/images/image-error.svg'
                    "
                    alt="Product Image"
                    style="width: 50px; height: 50px; object-fit: cover"
                  />
                </td>
                <td>{{ value.ten_vt }}</td>
                <td>
                  <button @click="addProductSuggest(value)" class="btn btn-sm btn-primary">Chọn</button>
                </td>
              </tr>
            </tbody>
          </table>
          <SharedModulePagination
            :pagination="listProduct?.pagination"
            @page-change="
              filterListProduct.pageIndex = $event;
              getListProduct();
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from "bootstrap";
import {
  BaseResponse,
  BodyFilter,
  FilterItem,
  OperatorType,
  type ITemsTapmed,
  type ProjectConfig,
} from "~/model";
const { $bootstrap } = useNuxtApp();

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Tài khoản", to: "/auth" },
  { label: "Quản lý sản phẩm đề xuất" },
]);
const loading = ref(false);
const { $appServices } = useNuxtApp();
const keyword = useDebouncedRef("", 500);
const listProduct = ref<BaseResponse<ITemsTapmed>>();
const filterListProduct = ref(
  new BodyFilter<ITemsTapmed>({
    pageIndex: 1,
    pageSize: 5,
    filters: [
      new FilterItem<ITemsTapmed>({
        filterValue: "ten_vt",
        operatorType: OperatorType.Contains,
        valueSearch: "",
      }),
      new FilterItem<ITemsTapmed>({
        filterValue: "ten_nhasanxuat",
        operatorType: OperatorType.Contains,
        valueSearch: "",
      }),
    ],
  })
);
watch(keyword, (newVal) => {
  filterListProduct.value.setValue("ten_vt", newVal, OperatorType.Contains);
  filterListProduct.value.pageIndex = 1;
  getListProduct();
});
async function getListProduct() {
  try {
    loading.value = true;
    const response = await $appServices.items.getItems(filterListProduct.value);
    console.log("🚀 ~ getListProduct ~ response=>", response);
    listProduct.value = response;
  } catch (error) {
    console.error("Error fetching product list:", error);
  } finally {
    loading.value = false;
  }
}

const modalInstance = ref<Modal | null>(null);

const emit = defineEmits(["close", "created"]);
const props = defineProps<{
  editId?: string;
}>();

onMounted(() => {
  initModal();
  getListProduct();
});

function initModal() {
  const modal = document.getElementById("modal-news");
  modalInstance.value = new $bootstrap.Modal(modal!);
  modalInstance.value.show();
  modal!.addEventListener("hidden.bs.modal", () => {
    emit("close");
  });
}

async function addProductSuggest(product: ITemsTapmed) {
  try {
    const rsData = await $appServices.items.addProductSuggest({
      list_code:"HOME",
      ma_vt: product.ma_vt,
      ten_vt: product.ten_vt
    });
    useToast().success("Thêm sản phẩm đề xuất thành công.");
    modalInstance.value?.hide();
    emit("created");
  } catch (error) {
    console.error("Error adding product suggest:", error);
    useToast().error("Thêm sản phẩm đề xuất thất bại.");
  }
}
</script>

