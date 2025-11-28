<template>
  <LayoutAuth
    :loading="loading"
    name="Theo dõi đơn hàng"
    :breadcrumb="breadcrumb"
  >
    <div class="row">
      <div class="col-lg-8">
        <input
          type="search"
          v-model="keywordSearch"
          placeholder="Tìm kiếm đơn hàng"
          class="form-control mb-2"
        />
      </div>
      <div class="col-lg-4">
        <ClientOnly>
          <VueDatePicker
            v-model="dates"
            :locale="vi"
            :time-config="{ enableTimePicker: false }"
            auto-apply
            range
          >
          </VueDatePicker>
        </ClientOnly>
      </div>
    </div>
    <template v-if="listOrder?.getData?.length">
      <div
        class="cart-header d-none border w-100 d-lg-table-row bg-light fw-semibold"
      >
        <span class="d-lg-table-cell p-3 py-2">STT</span>
        <span class="d-lg-table-cell p-3 py-2">Mã Đơn Hàng</span>
        <span class="d-lg-table-cell p-3 py-2">Ngày Tạo</span>
        <span class="d-lg-table-cell p-3 py-2">Tổng Giá</span>
        <!-- <span class="d-lg-table-cell p-3 py-2">Số Lượng</span> -->

        <span class="d-lg-table-cell p-3 py-2 text-end text-nowrap">
          Trạng thái
        </span>
        <span class="d-lg-table-cell p-3 py-2 text-center text-nowrap"
          >Hành Động</span
        >
      </div>

      <!-- Item -->
      <div
        v-for="(order, index) in listOrder?.getData"
        class="cart-item d-block border w-100 d-lg-table-row align-middle border rounded-3 p-3 mb-3 bg-white shadow-sm"
      >
        <!-- Product -->
        <div
          class="cart-price text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
        >
          <span class="d-lg-none fw-semibold">STT:</span>
          <span>{{ index + 1 }}</span>
        </div>
        <div
          class="cart-product w-custom mb-lg-0 mb-3 d-flex justify-content-between align-items-start gap-3 d-lg-table-cell p-lg-3"
        >
          <span class="d-lg-none fw-semibold">Mã Đơn Hàng:</span>
          <div class="d-flex flex-column align-items-lg-start">
            <span class="fw-medium ms-2 text-end">#{{ order.stt_rec }}</span>
          </div>
        </div>
        <div
          class="cart-price w-custom text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
        >
          <span class="d-lg-none fw-semibold">Ngày Tạo:</span>
          <span>
            {{
              formatDate(
                typeof order.ngay_ct === "string"
                  ? order.ngay_ct
                  : order.ngay_ct?.toISOString()
              )
            }}</span
          >
        </div>
        <!-- Price -->
        <div
          class="cart-price w-custom text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
        >
          <span class="d-lg-none fw-semibold">Tổng Giá:</span>
          <span>{{ formatCurrency(order.tong_tien as number) }}</span>
        </div>
        <!-- <div
          class="cart-price w-custom text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3">
          <span class="d-lg-none fw-semibold">Số Lượng:</span>
          <span>{{ order.item_count }} mặt hàng</span>
        </div> -->
        <!-- Quantity -->

        <div
          class="cart-total align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
        >
          <span class="d-lg-none fw-semibold">Trạng thái:</span>
          <span class="text-lg-end text-nowrap">
            <!-- <span
            class="badge bg-warning d-flex fw-normal align-items-center gap-1 bg-opacity-10 text-dark border border-warning"
          >
            <FolderClock :stroke-width="2" :size="16" />
          </span> -->
            {{ StatusGiaoVan[order.status_giao_van] }}
          </span>
        </div>
        <!-- Total -->
        <div
          class="cart-total gap-2 align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-end d-lg-table-cell p-lg-3"
        >
          <div class="d-flex justify-content-end gap-1">
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
        <SharedModulePagination
          :pagination="listOrder?.pagination"
          @page-change="
            filterListOrder.pageIndex = $event;
            getListOrder();
          "
        />
      </div>
    </template>
    <div
      v-else
      class="d-flex w-100 flex-column align-items-center justify-content-center gap-2"
    >
      <UiEmpty />
      <h5 class="text-center text-capitalize">bạn chưa có đơn hàng nào.</h5>
    </div>
  </LayoutAuth>

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
import "@vuepic/vue-datepicker/dist/main.css";
import { VueDatePicker } from "@vuepic/vue-datepicker";

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
import { addDays } from "date-fns";
import { vi } from "date-fns/locale";
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

const keywordSearch = useDebouncedRef("", 500);
const dates = ref([addDays(new Date(), 30), new Date()]);
const loading = ref(false);
const showModalDetail = ref<string | undefined>(undefined);
const showModalCreateTicket = ref(false);
const filterListOrder = ref(
  new BodyFilter<TapmedOrderItem>({
    pageIndex: 1,
    pageSize: 5,
    fromDate: "",
    toDate: "",
    filters: [
      new FilterItem({
        filterValue: "stt_rec",
        operatorType: OperatorType.Contains,
        valueSearch: keywordSearch.value,
      }),
    ],
  })
);

const listOrder = ref<BaseResponse<TapmedOrderItem>>();

watch(
  () => keywordSearch.value,
  (newVal) => {
    filterListOrder.value.setValue("stt_rec", newVal, OperatorType.Contains);
    filterListOrder.value.pageIndex = 1;
    getListOrder();
  }
);
watch(
  () => dates.value,
  (newVal) => {
    if ((newVal.filter(Boolean).length || 0) !== 2) return;
    const value = newVal.filter((date) => date !== null) as Date[];
    if (value.length === 2) {
      const [startDate, endDate] = value;
      filterListOrder.value.fromDate = new Date(startDate!).toISOString();
      filterListOrder.value.toDate = new Date(endDate!).toISOString();
    } else {
      filterListOrder.value.fromDate = "";
      filterListOrder.value.toDate = "";
    }
    filterListOrder.value.pageIndex = 1;
    getListOrder();
  }
);

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
  loading.value = true;
  try {
    const response = await $appServices.order.listOrder(filterListOrder.value);
    listOrder.value = response;
  } catch (error) {
    console.log("🚀 ~ error=>", error);
  } finally {
    loading.value = false;
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
