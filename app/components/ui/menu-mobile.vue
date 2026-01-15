<template>
  <div class="sticky-bottom d-md-none rounded-top p-2 bg-primary w-100">
    <div class="d-flex justify-content-between gap-2">
      <nuxt-link to="/" class="d-flex text-decoration-none align-items-center text-white flex-column">
        <House :stroke-width="2" />
        <small>Trang chủ</small>
      </nuxt-link>
      <nuxt-link to="/quick-order" class="d-flex text-decoration-none align-items-center text-white flex-column">
        <Package :stroke-width="2" />
        <small>Đặt Hàng</small>
      </nuxt-link>
      <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom"
        class="d-flex align-items-center text-white flex-column">
        <Search :stroke-width="2" />
        <small>Tìm kiếm</small>
      </div>
      <nuxt-link to="/cart" class="d-flex align-items-center text-decoration-none text-white flex-column">
        <ShoppingBag :stroke-width="2" />
        <small>Giỏ hàng</small>
      </nuxt-link>
      <div @click="togglePopupLogin" class="d-flex align-items-center text-white flex-column">
        <CircleUser :stroke-width="2" />
        <small v-if="!user?.data.ten_kh"> Tài khoản</small>
        <small v-else class="text-break">{{ user?.data.ten_kh }}</small>
      </div>
    </div>
  </div>

  <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasBottomLabel">
        Tìm kiếm sản phẩm
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body py-0">
      <OrderModuleList :loading="pageState.loading" :list="pageState.listProduct.getData" />
    </div>
    <div class="offcanvas-footer bg-light p-3">
      <div class="d-flex">
        <UiInputSearch v-model="keyword" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    OperatorType,
    type BaseParameters,
    type BaseResponse,
    BodyFilter,
    type ITemsTapmed,
  } from "~/model";

  const { togglePopupLogin, user } = useAuth();
  const { $appServices } = useNuxtApp();
  const keyword = useDebouncedRef("", 500);
  const filterBody = ref<BodyFilter>(
    new BodyFilter({
      pageIndex: 1,
      pageSize: 10,
      filters: [
        {
          filterValue: "ten_vt",
          operatorType: OperatorType.Contains,
          valueSearch: "",
        },
      ],
    })
  );
  const pageState = reactive({
    loading: true,
    listProduct: {} as BaseResponse<ITemsTapmed>,
  });
  watch(keyword, (newVal) => {
    filterBody.value.setValue("ten_vt", newVal);
    getListProduct();
  });

  async function getListProduct() {
    pageState.loading = true;
    try {
      const response = await $appServices.items.getItems(filterBody.value);
      pageState.listProduct = response;
    } catch (error) {
      console.error("Error fetching product list:", error);
    } finally {
      pageState.loading = false;
    }
  }
  onMounted(() => {
    getListProduct();
  });
</script>

<style scoped>
  .offcanvas {
    height: 80vh;
  }

  small {
    font-size: 0.75rem;
    text-transform: capitalize;
  }

  .sticky-bottom {
    z-index: 0 !important;
  }

  .text-break {
    max-width: 86px;
    word-break: break-word;
  }
</style>
