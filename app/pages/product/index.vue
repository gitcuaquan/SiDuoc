<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />

  <div class="container">
    <div class="row mt-3">
      <div class="col-lg-3">
        <div class="mb-3">
          <div class="d-flex gap-2 align-items-center">
            <input
              v-model="keyword"
              type="text"
              class="form-control form-control-sm"
              placeholder="Tìm kiếm sản phẩm..."
            />
            <!-- Offcanvas trigger (mobile only) -->
            <button
              class="btn h-100 d-block btn-sm d-lg-none btn-outline-secondary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#nhomOffcanvas"
              aria-controls="nhomOffcanvas"
            >
              <Funnel :size="14" />
            </button>
          </div>
        </div>

        <!-- Desktop filters -->
        <div class="d-none d-lg-block">
          <label class="form-label fw-bold"> Lọc theo phân loại </label>
          <div class="d-flex flex-wrap gap-2">
            <input
              type="radio"
              class="btn-check"
              v-model="phanLoaiVtSelected"
              :value="null"
              name="phan-loai-vt-dt"
              id="plvt-dt-all"
              autocomplete="off"
            />
            <label
              class="btn btn-sm rounded-1 d-flex align-items-center gap-2 fw-normal btn-outline-primary badge"
              for="plvt-dt-all"
            >
              Tất cả loại thuốc
            </label>

            <template v-for="value in phanLoaiVt" :key="value.ma_plvt">
              <input
                type="radio"
                class="btn-check"
                v-model="phanLoaiVtSelected"
                :value="value.ma_plvt"
                name="phan-loai-vt-dt"
                :id="`plvt-dt-${value.ma_plvt}`"
                autocomplete="off"
              />
              <label
                class="btn btn-sm rounded-1 d-flex align-items-center gap-2 fw-normal btn-outline-primary badge"
                :for="`plvt-dt-${value.ma_plvt}`"
              >
                {{ value.ten_plvt }}
              </label>
            </template>
          </div>

          <label class="form-label fw-bold mt-3"> Lọc theo phân nhóm </label>
          <ul class="list-unstyled">
            <li class="mb-1">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="phanNhomVtSelected"
                  :value="null"
                  name="nhom-vat-tu-dt"
                  id="nhom-vt-dt-all"
                />
                <label class="form-check-label" for="nhom-vt-dt-all">
                  <small> Tất cả nhóm thuốc</small>
                </label>
              </div>
            </li>

            <li v-for="value in phanNhomVt" :key="value.ma_pnvt" class="mb-1">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="phanNhomVtSelected"
                  :value="value.ma_pnvt"
                  name="nhom-vat-tu-dt"
                  :id="`nhom-vt-dt-${value.ma_pnvt}`"
                />
                <label
                  class="form-check-label"
                  :for="`nhom-vt-dt-${value.ma_pnvt}`"
                >
                  <small> {{ value.ten_pnvt }}</small>
                </label>
              </div>
            </li>
          </ul>
        </div>

        <!-- Mobile offcanvas with accordion duplicate (visible on small screens) -->
        <div
          class="offcanvas offcanvas-start d-lg-none"
          tabindex="-1"
          id="nhomOffcanvas"
          aria-labelledby="nhomOffcanvasLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="nhomOffcanvasLabel">Bộ lọc</h5>
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <label class="form-label fw-bold"> Lọc theo phân loại </label>
            <div class="d-flex flex-wrap gap-2">
              <input
                type="radio"
                class="btn-check"
                v-model="phanLoaiVtSelected"
                :value="null"
                name="phan-loai-vt-mb"
                id="plvt-mb-all"
                autocomplete="off"
              />
              <label
                class="btn btn-sm rounded-1 d-flex align-items-center gap-2 fw-normal btn-outline-primary badge"
                for="plvt-mb-all"
              >
                Tất cả loại thuốc
              </label>

              <template
                v-for="value in phanLoaiVt"
                :key="`mb-${value.ma_plvt}`"
              >
                <input
                  type="radio"
                  class="btn-check"
                  v-model="phanLoaiVtSelected"
                  :value="value.ma_plvt"
                  name="phan-loai-vt-mb"
                  :id="`plvt-mb-${value.ma_plvt}`"
                  autocomplete="off"
                />
                <label
                  class="btn btn-sm rounded-1 d-flex align-items-center gap-2 fw-normal btn-outline-primary badge"
                  :for="`plvt-mb-${value.ma_plvt}`"
                >
                  {{ value.ten_plvt }}
                </label>
              </template>
            </div>

            <label class="form-label fw-bold mt-3"> Lọc theo phân nhóm </label>
            <ul class="list-unstyled">
              <li class="mb-1">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    v-model="phanNhomVtSelected"
                    :value="null"
                    name="nhom-vat-tu-mb"
                    id="nhom-vt-mb-all"
                  />
                  <label class="form-check-label" for="nhom-vt-mb-all">
                    <small> Tất cả nhóm thuốc</small>
                  </label>
                </div>
              </li>

              <li
                v-for="value in phanNhomVt"
                :key="`mb-pn-${value.ma_pnvt}`"
                class="mb-1"
              >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    v-model="phanNhomVtSelected"
                    :value="value.ma_pnvt"
                    name="nhom-vat-tu-mb"
                    :id="`nhom-vt-mb-${value.ma_pnvt}`"
                  />
                  <label
                    class="form-check-label"
                    :for="`nhom-vt-mb-${value.ma_pnvt}`"
                  >
                    <small> {{ value.ten_pnvt }}</small>
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-lg-9 position-relative" style="min-height: 100vh">
        <div
          v-if="pending"
          style="z-index: 1; backdrop-filter: blur(4px)"
          class="top-0 bg-dark bg-opacity-10 position-absolute end-0 w-100 h-100 d-flex justify-content-center align-items-center p-3"
        >
          <ui-loading />
        </div>
        <div v-if="!pending && data?.items.length" class="row g-4">
          <div class="col-6 col-md-4 col-lg-3" v-for="item in data?.items">
            <div class="card overflow-hidden position-relative h-100">
              <nuxt-link
                :to="`/product/${item.ma_vt}`"
                class="text-decoration-none"
              >
                <template v-if="(Number(item.co_ck) || 0) == 1">
                  <div
                    class="position-absolute w-100 bg-white top-0 shadow-sm bg-opacity-50 text-center p-1"
                    style="z-index: 999999; backdrop-filter: blur(4px)"
                  >
                    <small
                      class="text-center d-flex align-items-center gap-1 justify-content-center text-primary"
                      style="font-size: 12px; font-weight: 500"
                    >
                      <Gift :size="16" /> Sản phẩm đang có khuyến mãi
                    </small>
                  </div>
                </template>
                <div class="ratio-1x1 ratio card-img-top overflow-hidden">
                  <img
                    :src="
                      item.image_urls?.[0]?.url || '/images/image-error.svg'
                    "
                    alt=""
                  />
                </div>
              </nuxt-link>
              <div
                class="card-body d-flex flex-column gap-2 justify-content-between p-1 position-relative"
              >
                <nuxt-link
                  :to="`/product/${item.ma_vt}`"
                  class="text-decoration-none"
                >
                  <div class="card-title m-0 text-dark">{{ item.ten_vt }}</div>
                </nuxt-link>
                <div
                  class="d-flex align-items-center flex-wrap justify-content-between"
                >
                  <div>
                    Giá:
                    <small class="text-primary">
                      {{ formatCurrency(item.gia_nt2) }}
                    </small>
                  </div>
                  <template v-if="isAuthenticated">
                    <UiBtnGroup
                      :max="
                        (item.sl_toi_da || 0) == 0 ? 9999999 : item.sl_toi_da
                      "
                      size="sm"
                      class="mt-auto"
                      v-model="item.quantity"
                      @change="($event: number) => changeQuantity(item, $event)"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!pending && !data?.items.length" class="pt-5">
          <ui-empty class="mx-auto w-50" />
          <div class="text-center text-muted mt-3">
            Không có sản phẩm nào phù hợp
          </div>
        </div>
        <shared-module-pagination
          class="mt-3"
          v-if="!pending && data?.items.length"
          @page-change="onPageChange"
          :pagination="data?.pagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BodyFilter,
  FilterItem,
  Item,
  OperatorType,
  type ITemsTapmed,
  type ProjectConfig,
} from "~/model";
import type { PhanLoaiVT, PhanNhomVT } from "~/model/item/ITemsTapmed";

// SEO Meta Tags for Product List Page
useSeoMeta({
  title: "Danh sách sản phẩm dược phẩm | Sỉ Dược",
  description:
    "Duyệt qua bộ sưu tập đầy đủ sản phẩm dược phẩm, vitamin, thực phẩm chức năng. Tìm kiếm và mua sỉ với giá tốt nhất.",
  ogTitle: "Sản phẩm dược phẩm | Sỉ Dược",
  ogDescription:
    "Khám phá hàng loạt sản phẩm dược phẩm, vitamin chất lượng cao với giá sỉ cạnh tranh.",
  ogImage: "/images/final-medial.png",
  ogImageAlt: "Danh sách sản phẩm Sỉ Dược",
});

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Danh sách sản phẩm" },
]);
const { $appServices } = useNuxtApp();
const { addToCart, getQtyById, cart, updateQuantity } = useCart();
const { isAuthenticated, togglePopupLogin } = useAuth();

const keyword = useDebouncedRef("", 500);
const nhomVtSleected = ref<Array<Item.NhomVatTu>>([]);

const phanLoaiVt = ref<Array<PhanLoaiVT>>([]);
const phanNhomVt = ref<Array<PhanNhomVT>>([]);

const phanLoaiVtSelected = ref<any>(null);
watch(
  () => phanLoaiVtSelected.value,
  (newVal) => {
    console.log("Phân loại VT đã chọn:", newVal);
    filterListProduct.value.pageIndex = 1;
    if (newVal) {
      filterListProduct.value.setValue("ma_plvt", newVal, OperatorType.Equal);
    } else {
      // Nếu không có phân loại nào được chọn, loại bỏ bộ lọc
      filterListProduct.value.filters = filterListProduct.value.filters.filter(
        (filter) => filter.filterValue !== "ma_plvt",
      );
    }
    refresh(); // Gọi lại API khi giá trị thay đổi
  },
  { deep: true },
);
const phanNhomVtSelected = ref<any>(null);
watch(
  () => phanNhomVtSelected.value,
  (newVal) => {
    console.log("Phân nhóm VT đã chọn:", newVal);
    filterListProduct.value.pageIndex = 1;
    if (newVal) {
      filterListProduct.value.setValue("ma_pnvt", newVal, OperatorType.Equal);
    } else {
      // Nếu không có phân nhóm nào được chọn, loại bỏ bộ lọc
      filterListProduct.value.filters = filterListProduct.value.filters.filter(
        (filter) => filter.filterValue !== "ma_pnvt",
      );
    }
    refresh(); // Gọi lại API khi giá trị thay đổi
  },
  { deep: true },
);

const filterListProduct = ref(
  new BodyFilter<ITemsTapmed>({
    pageIndex: 1,
    pageSize: 20,
    filters: [
      new FilterItem<ITemsTapmed>({
        filterValue: "ten_vt",
        operatorType: OperatorType.Contains,
        valueSearch: keyword.value,
      }),
    ],
  }),
);
// const listNhomVatTu = ref<Array<Item.NhomVatTu>>([]);

// const listNhomVatTuGrouped = computed(() => {
//   const grouped: Record<string, Array<Item.NhomVatTu>> = {};
//   for (const option of loaiNhomVatTuOptions) {
//     grouped[option.label] = listNhomVatTu.value.filter(
//       (nhom) => nhom.loai_nh === option.value
//     );
//   }
//   return grouped;
// });
/**
 * Lắng nghe thay đổi từ keyword để gọi lại API
 */
watch(
  () => [keyword.value],
  () => {
    filterListProduct.value.pageIndex = 1;
    filterListProduct.value.setValue(
      "ten_vt",
      keyword.value,
      OperatorType.Contains,
    );
    refresh(); // Gọi lại API khi giá trị thay đổi
  },
  { deep: true },
);

/**
 * Lấy danh sách sản phẩm
 */
const { data, pending, refresh } = useAsyncData(
  "get-list-product",
  async () => {
    const moreFilters = buildFilter();
    const deepCloneFilter = JSON.parse(
      JSON.stringify(filterListProduct.value),
    ) as BodyFilter<ITemsTapmed>;
    deepCloneFilter.filters = deepCloneFilter.filters.concat(moreFilters);
    const response = await $appServices.items.getItems(deepCloneFilter);
    return {
      items:
        response.getData?.map((item) => ({
          ...item,
          quantity: getQtyById(item.ma_vt),
        })) || [],
      pagination: response.pagination,
    };
  },
);

// Đồng bộ quantity khi giỏ hàng thay đổi
watch(
  () => cart.value,
  () => {
    if (data.value?.items) {
      data.value.items = data.value.items.map((item) => ({
        ...item,
        quantity: getQtyById(item.ma_vt),
      }));
    }
  },
  { deep: true },
);

onMounted(() => {
  // nhaCungCapVt();
  getPhanNhomVt();
  getPhanLoaiVt();
});

/**
 * Lấy danh sách nhóm vật tư
 */
// async function nhaCungCapVt() {
//   loadingNhomVt.value = true;
//   try {
//     const response = await $appServices.items.getNhomVatTu<Item.NhomVatTu>(
//       filterNhomVt.value
//     );
//     console.log("🚀 ~ nhaCungCapVt ~ response=>", response);
//     listNhomVatTu.value = response.getData || [];
//   } catch (error) {
//     console.error("Error fetching Nhom Vat Tu:", error);
//   } finally {
//     loadingNhomVt.value = false;
//   }
// }

async function getPhanNhomVt() {
  try {
    const response = await $appServices.items.getPhanNhomVt<PhanNhomVT>();
    phanNhomVt.value = response.getData || [];
  } catch (error) {
    console.error("Error fetching Phan Nhom VT:", error);
  }
}
async function getPhanLoaiVt() {
  try {
    const response = await $appServices.items.getPhanLoaiVt<PhanLoaiVT>();
    phanLoaiVt.value = response.getData || [];
  } catch (error) {
    console.error("Error fetching Phan Loai VT:", error);
  }
}

function onPageChange(newPage: number) {
  filterListProduct.value.pageIndex = newPage;
  window.scrollTo(0, 0);
  refresh();
}

function toggleNhomVt(nhom: Item.NhomVatTu) {
  const index = nhomVtSleected.value.findIndex(
    (selected) => selected.ma_nh === nhom.ma_nh,
  );
  if (index > -1) {
    nhomVtSleected.value.splice(index, 1);
  } else {
    nhomVtSleected.value.push(nhom);
  }
  filterListProduct.value.pageIndex = 1;
  refresh();
}

function buildFilter() {
  const _filter: FilterItem<ITemsTapmed>[] = [];
  for (const item of nhomVtSleected.value) {
    Object.entries(item).forEach(([key, value]) => {
      if (key !== "ten_nh") {
        _filter.push(
          new FilterItem<ITemsTapmed>({
            filterValue: key as keyof ITemsTapmed,
            operatorType: OperatorType.Equal,
            valueSearch: value.toString(),
          }),
        );
      }
    });
  }

  return _filter;
}

function changeQuantity(item: ITemsTapmed, quantity: number) {
  if (isAuthenticated.value) {
    // Nếu quantity = 0 và sản phẩm chưa có trong giỏ, bỏ qua
    if (quantity === 0 && getQtyById(item.ma_vt) === 0) {
      return;
    }
    // Nếu sản phẩm đã có trong giỏ, dùng updateQuantity
    if (getQtyById(item.ma_vt) > 0) {
      updateQuantity(item.ma_vt, quantity);
    } else {
      // Sản phẩm chưa có trong giỏ, dùng addToCart
      item.quantity = quantity;
      addToCart(item);
    }
  } else {
    useToast().error("Vui lòng đăng nhập để sử dụng chức năng này");
    togglePopupLogin();
  }
}
</script>
<style scoped>
.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.card {
  box-shadow: 0 2px 4px #ebebeb;
  transition: all 0.2s ease-in-out;
  border: 1px solid #18984700;
}

.card:hover {
  box-shadow: 0 4px 8px #1898478a !important;
  border: 1px solid #189847 !important;
}

.card-action {
  transition: all 0.2s ease-in-out;
  top: -100% !important;
}

.card:hover .card-action {
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.137);
  top: 0 !important;
}

.btn-check:checked + .btn,
:not(.btn-check) + .btn:active,
.btn:first-child:active,
.btn.active,
.btn.show {
  color: white !important;
  background-color: var(--bs-btn-active-bg);
  border-color: var(--bs-btn-active-border-color);
}

.badge {
  color: var(--bs-primary) !important;
}
</style>
