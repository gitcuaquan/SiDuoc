<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />

  <div class="container">
    <div class="row mt-3">
      <div class="col-lg-3">
        <div class="mb-3">
          <div class="d-flex gap-2 align-items-center">
            <input v-model="keyword" type="text" class="form-control" placeholder="Tìm kiếm sản phẩm..." />
            <!-- Offcanvas trigger (mobile only) -->
            <button class="btn h-100 d-block d-lg-none btn-outline-secondary" type="button" data-bs-toggle="offcanvas"
              data-bs-target="#nhomOffcanvas" aria-controls="nhomOffcanvas">
              <Funnel :size="16" />
            </button>
          </div>
        </div>
        <div class="d-none d-lg-block">
          <div v-if="loadingNhomVt" class="text-center d-flex justify-content-center align-items-center w-100 p-5 my-3">
            <ui-loading />
          </div>
          <div v-else class="accordion accordion-flush" id="nhomAccordionDesktop">
            <div class="accordion-item" v-for="(value, name, nhIndex) in listNhomVatTuGrouped"
              :key="`mobile-${name}-${nhIndex}`">
              <h2 class="accordion-header" :id="`heading-mobile-${nhIndex}`">
                <button class="accordion-button px-2 collapsed text-capitalize fw-bold" type="button"
                  data-bs-toggle="collapse" :data-bs-target="`#collapse-mobile-${nhIndex}`"
                  :aria-expanded="nhIndex === 0 ? 'true' : 'false'" :aria-controls="`collapse-mobile-${nhIndex}`">
                  <Funnel :size="16" :stroke-width="1" class="me-2" />
                  {{ name }}
                </button>
              </h2>
              <div :id="`collapse-mobile-${nhIndex}`" :class="[
                'accordion-collapse',
                'mb-1',
                'collapse',
                nhIndex === 0 ? 'show' : '',
              ]" :aria-labelledby="`heading-mobile-${nhIndex}`" data-bs-parent="#nhomAccordionMobile">
                <div class="accordion-body py-0 pt-1 px-2">
                  <template v-if="value && value.length">
                    <div v-for="nhom in value" :key="`mobile-${nhom.ma_nh}`" class="form-check w-100">
                      <input class="form-check-input" type="checkbox" :name="`nhom-vat-tu`" @input="toggleNhomVt(nhom)"
                        :id="`radio-mobile-${nhIndex}-${nhom.ma_nh}`" />
                      <label class="form-check-label" :for="`radio-mobile-${nhIndex}-${nhom.ma_nh}`">
                        <small>{{ nhom.ten_nh }}</small>
                      </label>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-muted small">Không có mục</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Mobile offcanvas with accordion duplicate (visible on small screens) -->
        <div class="offcanvas offcanvas-start d-lg-none" tabindex="-1" id="nhomOffcanvas"
          aria-labelledby="nhomOffcanvasLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="nhomOffcanvasLabel">Bộ lọc</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <div class="accordion accordion-flush" id="nhomAccordionMobile">
              <div class="accordion-item" v-for="(value, name, nhIndex) in listNhomVatTuGrouped"
                :key="`mobile-${name}-${nhIndex}`">
                <h2 class="accordion-header" :id="`heading-mobile-${nhIndex}`">
                  <button class="accordion-button px-2 collapsed text-capitalize fw-bold" type="button"
                    data-bs-toggle="collapse" :data-bs-target="`#collapse-mobile-${nhIndex}`"
                    :aria-expanded="nhIndex === 0 ? 'true' : 'false'" :aria-controls="`collapse-mobile-${nhIndex}`">
                    <Funnel :size="16" :stroke-width="1" class="me-2" />
                    {{ name }}
                  </button>
                </h2>
                <div :id="`collapse-mobile-${nhIndex}`" :class="[
                  'accordion-collapse',
                  'mb-1',
                  'collapse',
                  nhIndex === 0 ? 'show' : '',
                ]" :aria-labelledby="`heading-mobile-${nhIndex}`" data-bs-parent="#nhomAccordionMobile">
                  <div class="accordion-body py-0 pt-1 px-2">
                    <template v-if="value && value.length">
                      <div v-for="nhom in value" :key="`mobile-${nhom.ma_nh}`" class="form-check w-100">
                        <input class="form-check-input" type="checkbox" :name="`nhom-vat-tu`"
                          @input="toggleNhomVt(nhom)" :id="`radio-mobile-${nhIndex}-${nhom.ma_nh}`" />
                        <label class="form-check-label" :for="`radio-mobile-${nhIndex}-${nhom.ma_nh}`">
                          <small>{{ nhom.ten_nh }}</small>
                        </label>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-muted small">Không có mục</div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9 position-relative" style="min-height: 100vh">
        <div v-if="pending" style="z-index: 1; backdrop-filter: blur(4px)"
          class="top-0 bg-dark bg-opacity-10 position-absolute end-0 w-100 h-100 d-flex justify-content-center align-items-center p-3">
          <ui-loading />
        </div>
        <div v-if="!pending && data?.items.length" class="row g-2">
          <div class="col-6 col-md-4 col-lg-3" v-for="item in data?.items">
            <div class="card overflow-hidden h-100">
              <nuxt-link :to="`/product/${item.ma_vt}`" class="text-decoration-none">
                <div class="ratio-1x1 ratio card-img-top overflow-hidden">
                  <img :src="item.image_urls?.[0]?.url || '/images/image-error.svg'
                    " alt="" />
                </div>
              </nuxt-link>
              <div class="card-body position-relative">
                <nuxt-link :to="`/product/${item.ma_vt}`" class="text-decoration-none">
                  <div class="card-title text-dark">{{ item.ten_vt }}</div>
                </nuxt-link>
                <button @click="fncAddToCart(item)"
                  class="btn d-flex text-nowrap justify-content-center w-100 gap-2 align-items-center flex-nowrap btn-sm btn-primary">
                  <PackagePlus :stroke-width="2" :size="20" />
                  <small>Thêm vào giỏ hàng</small>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!pending && !data?.items.length" class="pt-5">
          <ui-empty class="mx-auto" />
          <div class="text-center text-muted mt-3">
            Không có sản phẩm nào phù hợp
          </div>
        </div>
        <shared-module-pagination class="mt-3" v-if="!pending && data?.items.length" @page-change="onPageChange"
          :pagination="data?.pagination" />
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

  // SEO Meta Tags for Product List Page
  useSeoMeta({
    title: 'Danh sách sản phẩm dược phẩm | Sỉ Dược',
    description: 'Duyệt qua bộ sưu tập đầy đủ sản phẩm dược phẩm, vitamin, thực phẩm chức năng. Tìm kiếm và mua sỉ với giá tốt nhất.',
    ogTitle: 'Sản phẩm dược phẩm | Sỉ Dược',
    ogDescription: 'Khám phá hàng loạt sản phẩm dược phẩm, vitamin chất lượng cao với giá sỉ cạnh tranh.',
    ogImage: '/images/final-medial.png',
    ogImageAlt: 'Danh sách sản phẩm Sỉ Dược',
  })

  const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
    { label: "Danh sách sản phẩm" },
  ]);
  const { $appServices } = useNuxtApp();
  const { addToCart } = useCart();
  const { isAuthenticated, togglePopupLogin } = useAuth();

  const keyword = useDebouncedRef("", 500);
  const nhomVtSleected = ref<Array<Item.NhomVatTu>>([]);
  const loaiNhomVatTuOptions = [
    { value: Item.LoaiNhomVatTu.PhanNhom, label: "Phân nhóm" },
    // { value: Item.LoaiNhomVatTu.CongDung, label: "Công dụng" },
    // { value: Item.LoaiNhomVatTu.PhanLoai, label: "Phân loại" },
    // { value: Item.LoaiNhomVatTu.NguonGoc, label: "Nguồn gốc" },
    // { value: Item.LoaiNhomVatTu.QuyCach, label: "Quy cách" },
  ];
  const loadingNhomVt = ref(false);

  const filterNhomVt = ref(
    new BodyFilter<Item.NhomVatTu>({
      pageIndex: 1,
      pageSize: 1000,
    })
  );

  const filterListProduct = ref(
    new BodyFilter<ITemsTapmed>({
      pageIndex: 1,
      pageSize: 16,
      filters: [
        new FilterItem<ITemsTapmed>({
          filterValue: "ten_vt",
          operatorType: OperatorType.Contains,
          valueSearch: keyword.value,
        }),
      ],
    })
  );
  const listNhomVatTu = ref<Array<Item.NhomVatTu>>([]);

  const listNhomVatTuGrouped = computed(() => {
    const grouped: Record<string, Array<Item.NhomVatTu>> = {};
    for (const option of loaiNhomVatTuOptions) {
      grouped[option.label] = listNhomVatTu.value.filter(
        (nhom) => nhom.loai_nh === option.value
      );
    }
    return grouped;
  });

  watch(
    () => [keyword.value],
    () => {
      filterListProduct.value.pageIndex = 1;
      filterListProduct.value.setValue(
        "ten_vt",
        keyword.value,
        OperatorType.Contains
      );
      refresh(); // Gọi lại API khi giá trị thay đổi
    },
    { deep: true }
  );

  const { data, pending, refresh } = useAsyncData(
    "get-list-product",
    async () => {
      const moreFilters = buildFilter();
      const deepCloneFilter = JSON.parse(
        JSON.stringify(filterListProduct.value)
      ) as BodyFilter<ITemsTapmed>;
      deepCloneFilter.filters = deepCloneFilter.filters.concat(moreFilters);
      const response = await $appServices.items.getItems(deepCloneFilter);
      return {
        items: response.getData || [],
        pagination: response.pagination,
      };
    }
  );
  onMounted(() => {
    getNhomVatTu();
  });
  async function getNhomVatTu() {
    loadingNhomVt.value = true;
    try {
      const response = await $appServices.items.getNhomVatTu<Item.NhomVatTu>(
        filterNhomVt.value
      );
      listNhomVatTu.value = response.getData || [];
    } catch (error) {
      console.error("Error fetching Nhom Vat Tu:", error);
    } finally {
      loadingNhomVt.value = false;
    }
  }
  function onPageChange(newPage: number) {
    filterListProduct.value.pageIndex = newPage;
    window.scrollTo(0, 0);
    refresh();
  }

  function toggleNhomVt(nhom: Item.NhomVatTu) {
    const index = nhomVtSleected.value.findIndex(
      (selected) => selected.ma_nh === nhom.ma_nh
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
            })
          );
        }
      });
    }

    return _filter;
  }

  function fncAddToCart(item: ITemsTapmed) {
    if (!isAuthenticated.value) {
      useToast().error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      togglePopupLogin();
      return;
    }
    item.quantity = 1;
    addToCart(item, true);
    useToast().success("Đã thêm vào giỏ hàng");
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
</style>
