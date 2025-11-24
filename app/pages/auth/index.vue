<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="container mt-3">
    <div class="row py-3 g-3">
      <div class="col-lg-3 h-100">
        <LayoutAuthSiderbar class="sticky-top" />
      </div>
      <div class="col-lg-9">
        <h2 class="text-capitalize mb-3">Đơn hàng của bạn</h2>
        <div
          class="cart-header d-none border w-100 d-lg-table-row bg-light fw-semibold"
        >
          <span class="d-lg-table-cell p-3 py-2">Mã Đơn Hàng</span>
          <span class="d-lg-table-cell p-3 py-2">Đơn Giá</span>
          <span class="d-lg-table-cell p-3 py-2 text-center text-nowrap">
            Khách hàng
          </span>
          <span class="d-lg-table-cell p-3 py-2 text-end text-nowrap">
            Trạng thái
          </span>
          <span class="d-lg-table-cell p-3 py-2 text-center">Hành Động</span>
        </div>

        <!-- Item -->
        <div
          v-for="order in listOrder?.getData"
          class="cart-item d-block border w-100 d-lg-table-row align-middle border rounded-3 p-3 mb-3 bg-white shadow-sm"
        >
          <!-- Product -->
          <div
            class="cart-product w-custom mb-lg-0 mb-3 d-flex justify-content-between align-items-start gap-3 d-lg-table-cell p-lg-3"
          >
            <span class="d-lg-none fw-semibold">Mã Đơn Hàng:</span>
            <div class="d-flex flex-column align-items-lg-start">
              <span class="fw-medium ms-2 text-end">#{{ order.stt_rec }}</span>
              <small class="text-muted ms-2 fst-italic">
                Ngày tạo:
                {{
                  formatDate(
                    typeof order.ngay_ct === "string"
                      ? order.ngay_ct
                      : order.ngay_ct?.toISOString()
                  )
                }}
              </small>
            </div>
          </div>

          <!-- Price -->
          <div
            class="cart-price w-custom text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
          >
            <span class="d-lg-none fw-semibold">Đơn Giá:</span>
            <span>2000 Đ</span>
          </div>

          <!-- Quantity -->
          <div
            class="cart-qty w-custom align-middle d-flex text-lg-center mb-2 mb-lg-0 justify-content-between align-items-center d-lg-table-cell p-lg-3"
          >
            <span class="d-lg-none fw-semibold"> Khách hàng:</span>
            <span class="text-lg-center">{{ order.created_by }}</span>
          </div>
          <div
            class="cart-total align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
          >
            <span class="d-lg-none fw-semibold">Trạng thái:</span>
            <span class="text-lg-end">
              <span
                class="badge bg-warning d-flex fw-normal align-items-center gap-1 bg-opacity-10 text-dark border border-warning"
              >
                <FolderClock :stroke-width="2" :size="16" />{{
                  StatusGiaoVan[order.status_giao_van]
                }}</span
              >
            </span>
          </div>
          <!-- Total -->
          <div
            class="cart-total gap-2 align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-center d-lg-table-cell p-lg-3"
          >
            <div class="d-flex gap-1">
              <button
                @click="showModalDetail = order.stt_rec"
                class="btn-sm text-nowrap me-lg-2 btn btn-primary"
              >
                <Eye :size="16" />
              </button>
              <button
                @click="showModalCreateTicket = true"
                class="btn-sm text-nowrap me-lg-2 btn btn-danger"
              >
                <MessageCircleWarning :size="16" />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <SharedModulePagination />
        </div>
      </div>
    </div>
  </div>
  <ClientOnly>
    <AuthModalOrderDetail
      v-if="showModalDetail"
      @close="showModalDetail = undefined"
      :order_id="showModalDetail"
      @ticket="
        showModalCreateTicket = true;
        showModalDetail = undefined;
      "
    />
    <AuthModalCreateTicket
      v-if="showModalCreateTicket"
      @close="showModalCreateTicket = false"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>
import {
  BodyFilter,
  FilterItem,
  OperatorType,
  type BaseResponse,
  type ProjectConfig,
} from "~/model";
import {
  StatusGiaoVan,
  type TapmedOrder,
  type TapmedOrderItem,
} from "~/model/item/ITemsTapmed";
const { $appServices } = useNuxtApp();
const { setUser, clearUser } = useAuth();
const route = useRoute();

definePageMeta({
  middleware: "auth",
});

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Tài khoản", to: "/auth" },
  { label: "Đơn hàng của bạn" },
]);

const showModalDetail = ref<string | undefined>(undefined);
const showModalCreateTicket = ref(false);
const filterListOrder = ref(
  new BodyFilter<TapmedOrderItem>({
    pageIndex: 1,
    pageSize: 10,
    filters: [
      // new FilterItem<TapmedOrder>({
      //   filterValue: "ten_vt",
      //   operatorType: OperatorType.Contains,
      //   valueSearch: "",
      // }),
      // new FilterItem<TapmedOrder>({
      //   filterValue: "ten_nhasanxuat",
      //   operatorType: OperatorType.Contains,
      //   valueSearch: "",
      // }),
    ],
  })
);

const listOrder = ref<BaseResponse<TapmedOrderItem>>();

watch(
  () => route.fullPath,
  () => {
    if (route.query.order_id) {
      showModalDetail.value = route.query.order_id as string;
      useRouter().replace({ query: {} });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

async function getUser() {
  try {
    const response = await $appServices.customer.detail();
    setUser(response.data);
  } catch (error) {
    clearUser();
  }
}
async function getListOrder() {
  try {
    const response = await $appServices.order.listOrder(filterListOrder.value);
    listOrder.value = response;
  } catch (error) {
    console.log("🚀 ~ error=>", error);
  }
}
onMounted(async () => {
  await getUser();
  await getListOrder();
});
</script>

<style scoped>
.sticky-top {
  top: 80px;
  z-index: 0 !important;
}
@media screen and (min-width: 992px) {
  .w-custom {
    width: 25%;
  }
}
</style>
