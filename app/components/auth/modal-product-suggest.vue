<template>
  <div class="modal fade" id="modal-news" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Thêm sản phẩm nổi bật</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="search" class="form-control mb-3" placeholder="Tìm kiếm sản phẩm..." v-model="keyword" />
          <table class="table align-middle table-sm">
            <thead>
              <tr>
                <th scope="col" class="text-nowrap">Hình ảnh</th>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col" class="text-center">Đặt làm sản phẩm</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="value in listProduct?.getData" :key="value.ma_vt">
                <td>
                  <img :src="value.image_urls?.[0]?.url || '/images/image-error.svg'
                    " alt="Product Image" style="width: 50px; height: 50px; object-fit: cover" />
                </td>
                <td><small>{{ value.ten_vt }}</small></td>
                <td>
                  <div class="d-flex gap-2">
                    <button @click="addProductSuggest(value, 'HOME')" class="btn btn-sm btn-dark">
                      Nổi bật
                    </button>
                    <button @click="addProductSuggest(value, 'TopProduct')" class="btn btn-sm btn-outline-dark">
                      Ưu tiên
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <SharedModulePagination :pagination="listProduct?.pagination" @page-change="
            filterListProduct.pageIndex = $event;
          getListProduct();
          " />
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
} from "~/model";
const { $bootstrap } = useNuxtApp();


const loading = ref(false);
const { $appServices } = useNuxtApp();
const keyword = useDebouncedRef("", 500);
const listProduct = ref<BaseResponse<ITemsTapmed>>();
const filterListProduct = ref(
  new BodyFilter<ITemsTapmed>({
    pageIndex: 1,
    pageSize: 7,
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

async function addProductSuggest(product: ITemsTapmed, type?: 'HOME' | 'TopProduct') {
  try {
    const rsData = await $appServices.items.addProductSuggest({
      list_code: type || "HOME",
      ma_vt: product.ma_vt,
      ten_vt: product.ten_vt
    });
    useToast().success(`Thêm sản phẩm ${type == 'HOME' ? 'nổi bật' : 'ưu tiên'} thành công`);
    emit("created");
  } catch (error) {
    console.error("Error adding product suggest:", error);
    useToast().error(`Thêm sản phẩm ${type == 'HOME' ? 'nổi bật' : 'ưu tiên'} thất bại.`);
  }
}
</script>
