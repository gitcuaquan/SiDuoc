<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="container px-2 mt-3">
    <div class="row gy-2 gx-3">
      <div class="col-lg-8">
        <div class="card bg-white border-0 shadow-sm">
          <div
            class="card-header sticky-top top-custom shadow-sm px-1 py-1 px-md-2 bg-white border-0"
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
            </div>
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
                  Xác nhận đơn hàng
                </button>
              </div>
            </ClientOnly>
          </div>
          <h6>Chương trình khuyến mãi</h6>
          <ul class="list-group list-group-flush">
            <li
              v-for="discount in listNews?.data"
              :key="discount._id"
              class="list-group-item d-flex gap-2 p-1 position-relative justify-content-between align-items-center"
            >
              <NuxtLink
                :to="`/promotion/${discount.slug}`"
                class="stretched-link"
              ></NuxtLink>
              <div
                class="ratio ratio-16x9 rounded overflow-hidden flex-shrink-0"
                style="width: 70px"
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
    pageSize: 30,
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
watch(
  () => pageState.loading,
  (newVal) => {
    if (window) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
);
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
  top: 65px;
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
