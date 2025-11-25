<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="container px-2 mt-3">
    <div class="row gy-2 gx-3">
      <div class="col-lg-8">
        <div class="card bg-white border-0 shadow-sm">
          <div
            class="card-header shadow-sm px-1 py-1 px-md-2 bg-white border-0"
          >
            <div class="row g-2 align-items-center">
              <div class="col-lg-6 order-2">
                <UiInputSearch class="h-100" v-model="keyword" />
              </div>
              <div class="col-lg-6 order-1 order-lg-2">
                <div class="d-flex gap-2 h-100">
                  <div class="dropdown h-100 w-100">
                    <input
                      type="search"
                      readonly
                      data-bs-toggle="dropdown"
                      class="form-control h-100 form-control-sm"
                      placeholder="Nhà sản xuất"
                    />
                    <ul
                      class="dropdown-menu w-100"
                      style="max-height: 400px; overflow: auto"
                    >
                      <li
                        style="top: -10px"
                        class="px-3 py-2 bg-white sticky-top shadow-sm"
                      >
                        <input
                          type="search"
                          v-model="ten_nhasx"
                          placeholder="Tìm kiếm nhà sản xuất"
                          class="form-control form-control-sm"
                        />
                      </li>
                      <li v-for="value in listNhaSanXuat">
                        <a
                          @click="selectNhaSX(value)"
                          role="button"
                          class="dropdown-item"
                        >
                          {{ value.ten_nhasanxuat }}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <button
                    @click="showMoreFilters = true"
                    class="btn-sm btn btn-light position-relative shadow-sm border"
                  >
                    <span
                      class="position-absolute top-0 start-100 translate-middle lh-sm badge rounded-pill bg-danger"
                    >
                      {{ listFilter.length }}
                      <span class="visually-hidden">Filter count</span>
                    </span>
                    <Funnel :size="16" />
                  </button>
                </div>
              </div>
              <!-- <div class="col-lg-7">
                <div class="input-group w-100 input-group-sm h-100 flex-nowrap">
                  <select v-model="filterNhomVt.filters[0]!.valueSearch" class="form-select w-auto flex-grow-0" id="">
                    <option
                      v-for="value in loaiNhomVatTuOptions"
                      :value="value.value.toString()"
                    >
                      {{ value.label }}
                    </option>
                  </select>
                  <select class="form-select" >
                    <option
                      v-for="value in listNhomVatTu"
                    >
                      {{ value.ten_nh }}
                    </option>
                  </select>
                </div>
              </div> -->
              <!-- <div class="col-6">
                <div class="dropdown">
                  <button
                    class="btn w-100 px-2 text-nowrap d-flex gap-1 align-items-center border"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <BookOpenText
                      :stroke-width="1.5"
                      class="text-muted"
                      :size="16"
                    />
                    <small class="text-dark text-opacity-50 user-select-none">
                      Danh mục sản phẩm
                    </small>
                  </button>
                  <div class="dropdown-menu ps-2 border-0 shadow dropdown-menu-custom">
                    <div class="p-2 px-1">
                      <UiInputSearch
                        placeholder="Tìm kiếm danh mục"
                        v-model="categoriesKeyword"
                      />
                    </div>
                    <div class="dropdown-list p-3 py-0">
                      <UiTreeView :categories="categoriesFilter" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="dropdown">
                  <div
                    data-bs-toggle="dropdown"
                    class="form-control d-flex align-items-center gap-2"
                  >
                    <House :stroke-width="1.5" class="text-muted" :size="16" />
                    <small class="text-dark text-opacity-50 user-select-none">
                      Nhà cung cấp
                    </small>
                  </div>
                  <div
                    class="dropdown-menu border-0 shadow  dropdown-menu-custom dropdown-menu-end p-2"
                  >
                    <OrderModuleProvider class="mt-1" />
                  </div>
                </div>
              </div> -->
            </div>

            <!-- <div class="d-flex tag-scroll mt-2 flex-nowrap gap-2">
              <div
                class="text-uppercase badge d-flex gap-1 align-items-center bg-primary bg-opacity-10 text-primary"
              >
                SẢN PHẨM AIKYA <Tags :size="16" :stroke-width="1.5" />
              </div>
              <div
                class="text-uppercase badge d-flex gap-1 align-items-center bg-primary bg-opacity-10 text-primary"
              >
                Sản Phẩm TAPMED <Tags :size="16" :stroke-width="1.5" />
              </div>
              <div
                class="text-uppercase badge d-flex gap-1 align-items-center bg-primary bg-opacity-10 text-primary"
              >
                GIÁ TỐT TRONG TUẦN <Tags :size="14" :stroke-width="1.5" />
              </div>
              <div
                class="text-uppercase badge d-flex gap-1 align-items-center bg-primary bg-opacity-10 text-primary"
              >
                GIÁ TỐT TRONG THÁNG <Tags :size="14" :stroke-width="1.5" />
              </div>
            </div> -->
          </div>
          <div class="card-body px-1 px-md-2">
            <OrderModuleList
              :loading="pageState.loading"
              :list="pageState.listProduct.getData"
            />
            <SharedModulePagination
              v-if="pageState.listProduct.getData?.length"
              class="mt-3"
              :pagination="pageState.listProduct.pagination"
              @page-change="
                filterListProduct.pageIndex = $event;
                getListProduct();
              "
            />
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="sticky-custom">
          <div class="card bg-white border-0 shadow-sm mb-3">
            <div class="card-header border-0 bg-white shadow-sm">
              Giỏ hàng của bạn
              <nuxt-link to="/cart" class="float-end text-decoration-none">
                <small>Xem giỏ hàng</small>
              </nuxt-link>
            </div>
            <div class="card-body">
              <ClientOnly>
                <SharedModuleCart />
              </ClientOnly>
            </div>
            <ClientOnly>
              <div class="card-footer border-0 bg-white shadow-sm">
                <button
                  class="btn btn-primary w-100 mt-2"
                  :disabled="isCartEmpty"
                  @click="showCheckoutModal = true"
                >
                  Đặt hàng nhanh
                </button>
              </div>
            </ClientOnly>
          </div>
          <h6>Chương trình khuyến mãi</h6>
          <ul class="list-group">
            <li
              v-for="discount in listNews?.data"
              :key="discount._id"
              class="list-group-item d-flex gap-2 position-relative justify-content-between align-items-center"
            >
              <NuxtLink
                :to="`/promotion/${discount.slug}`"
                class="stretched-link"
              ></NuxtLink>
              <div
                class="ratio ratio-16x9 rounded overflow-hidden mb-2"
                style="width: 120px"
              >
                <img
                  :src="discount.thumbnail || '/images/image-error.svg'"
                  :alt="discount.title"
                  style="object-fit: cover"
                />
              </div>
              <small>{{ discount.title }}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <OrderModuleFilter
      :show="showMoreFilters"
      @close="showMoreFilters = false"
      @apply="applyFilter"
    />
    <CheckoutModalCheckOut
      v-if="showCheckoutModal"
      @close="showCheckoutModal = false"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>
useHead({
  title: "Đặt hàng nhanh - Sỉ Dược",
  meta: [
    {
      name: "description",
      content:
        "Đặt hàng nhanh các sản phẩm y tế và chăm sóc sức khỏe chất lượng cao từ Sỉ Dược. Tận hưởng quy trình mua sắm tiện lợi và nhanh chóng với đa dạng sản phẩm.",
    },
  ],
});
import type { BaseParameters, ProjectConfig, TapmedDiscount } from "~/model";
import { Item } from "~/model/Item";
import {
  BodyFilter,
  FilterItem,
  OperatorType,
  type BaseResponse,
  type ITemsTapmed,
} from "~/model";
const { $appServices } = useNuxtApp();

const { listFilter } = useFilter();
const { isCartEmpty } = useCart();
const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Đặt hàng nhanh" },
]);

const showMoreFilters = ref(false);
const keyword = useDebouncedRef("", 500);
const ten_nhasx = useDebouncedRef("", 500);

const showCheckoutModal = ref(false);
const parameterDiscount = ref<BaseParameters>({
  PageIndex: 1,
  PageSize: 3,
});

const pageState = reactive({
  loading: true,
  listProduct: {} as BaseResponse<ITemsTapmed>,
});

const filterListProduct = ref(
  new BodyFilter<ITemsTapmed>({
    pageIndex: 1,
    pageSize: 7,
    filters: [
      new FilterItem<ITemsTapmed>({
        filterValue: "ten_vt",
        operatorType: OperatorType.Contains,
        valueSearch: keyword.value,
      }),
      new FilterItem<ITemsTapmed>({
        filterValue: "ten_nhasanxuat",
        operatorType: OperatorType.Contains,
        valueSearch: "",
      }),
    ],
  })
);

const filterNhomVt = ref(
  new BodyFilter<Item.NhomVatTu>({
    pageIndex: 1,
    pageSize: 1000,
    filters: [
      new FilterItem<Item.NhomVatTu>({
        filterValue: "loai_nh",
        operatorType: OperatorType.Contains,
        valueSearch: Item.LoaiNhomVatTu.NguonGoc.toString(),
      }),
    ],
  })
);

const filterNhaSX = ref(
  new BodyFilter<any>({
    pageIndex: 1,
    pageSize: 1000,
    filters: [
      new FilterItem<any>({
        filterValue: "ten_nhasanxuat",
        operatorType: OperatorType.Contains,
        valueSearch: ten_nhasx.value,
      }),
    ],
  })
);
const listNhomVatTu = ref<Item.NhomVatTu[]>([]);
const listNhaSanXuat = ref<Item.NhaSanXuat[]>([]);
const listNews = ref<any>();
const loading = ref(true);
const queryList = ref({
  page: 1,
  limit: 4,
  category: "promotion",
});
watch(keyword, (newVal) => {
  filterListProduct.value.setValue("ten_vt", newVal, OperatorType.Contains);
  filterListProduct.value.pageIndex = 1;
  getListProduct();
});

watch(ten_nhasx, (newVal) => {
  getNhaSX();
});
watch(
  () => filterNhomVt.value,
  (val) => {
    getNhomVatTu();
  },
  { deep: true }
);

async function fetchNewsList() {
  loading.value = true;
  try {
    const rsData = await $fetch("/api/post/list", {
      query: {
        ...queryList.value,
      },
    });
    listNews.value = rsData;
  } catch (error) {
    console.error("Error fetching news list:", error);
  } finally {
    loading.value = false;
  }
}
// ======================== HOOKS ========================
onBeforeMount(() => {
  getListProduct();
  getNhomVatTu();
  getNhaSX();
  fetchNewsList();
});
// ======================== METHODS ========================

async function getNhomVatTu() {
  try {
    const response = await $appServices.items.getNhomVatTu<Item.NhomVatTu>(
      filterNhomVt.value
    );
    listNhomVatTu.value = response.getData || [];
  } catch (error) {
    console.error("Error fetching Nhom Vat Tu:", error);
  }
}

async function getNhaSX() {
  try {
    const response = await $appServices.items.getNhaSX<Item.NhaSanXuat>(
      filterNhaSX.value
    );
    listNhaSanXuat.value = response.getData || [];
  } catch (error) {
    console.error("Error fetching Nha San Xuat:", error);
  }
}

async function getListProduct() {
  const moreFilters = buildFilter();
  const deepCloneFilter = JSON.parse(
    JSON.stringify(filterListProduct.value)
  ) as BodyFilter<ITemsTapmed>;
  pageState.loading = true;
  try {
    deepCloneFilter.filters = deepCloneFilter.filters.concat(moreFilters);
    const response = await $appServices.items.getItems(deepCloneFilter);
    pageState.listProduct = response;
  } catch (error) {
    console.error("Error fetching product list:", error);
  } finally {
    pageState.loading = false;
  }
}

function buildFilter() {
  const _filter: FilterItem<ITemsTapmed>[] = [];
  for (const item of listFilter.value) {
    Object.entries(item).forEach(([key, value]) => {
      if (key !== "ten_nh") {
        _filter.push(
          new FilterItem<ITemsTapmed>({
            filterValue: key as keyof ITemsTapmed,
            operatorType: OperatorType.Equal,
            valueSearch: value.toString(),
          })
        );
      }
    });
  }
  return _filter;
}
function applyFilter() {
  getListProduct();
}

function selectNhaSX(nhasx: Item.NhaSanXuat) {
  filterListProduct.value.setValue(
    "ten_nhasanxuat",
    nhasx.ten_nhasanxuat,
    OperatorType.Contains
  );
  filterListProduct.value.pageIndex = 1;
  getListProduct();
}
</script>

<style scoped>
.top-custom {
  top: 48px;
  z-index: 1 !important;
}

.z-height {
  z-index: 999999999;
}
.dropdown-list {
  max-height: 400px;
  overflow-y: auto;
}
.dropdown-menu-custom {
  width: 500px;
  overflow-y: auto;
}
@media screen and (max-width: 768px) {
  .top-custom {
    top: 0;
  }

  .dropdown-menu-custom {
    width: 350px !important;
    margin: auto;
  }
}
.sticky-custom {
  position: sticky;
  top: 60px;
  z-index: 0;
}
.badge {
  font-size: 0.6rem;
  padding: 0.3rem 0.5rem;
  font-weight: 500;
  cursor: pointer;
}
.tag-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  padding-bottom: 5px;
  padding-top: 5px;
}
</style>
