<template>
  <LayoutAuth name="Hỗ trợ khách hàng" :breadcrumb="breadcrumb">
    <template v-if="ticketList?.getData && ticketList.getData.length > 0">
      <div
        class="cart-header table-fake d-none border w-100 d-lg-table-row bg-light fw-semibold"
      >
        <span class="d-lg-table-cell text-nowrap p-3 py-2">Mã Khiếu Nại</span>
        <span class="d-lg-table-cell w-custom p-3 py-2">Vấn đề</span>
        <span class="d-lg-table-cell p-3 py-2 text-end text-nowrap">
          Trạng thái
        </span>
      </div>

      <!-- Item -->
      <div
        v-for="value in ticketList.getData"
        class="cart-item d-block border w-100 d-lg-table-row align-middle border rounded-3 p-3 mb-3 bg-white shadow-sm"
      >
        <div
          class="cart-product mb-lg-0 mb-3 d-flex justify-content-between align-items-start gap-3 d-lg-table-cell p-lg-3"
        >
          <span class="d-lg-none fw-semibold">Mã khiếu nại:</span>
          <div class="d-flex flex-column align-items-start">
            <span class="fw-medium ms-2">{{ value?.stt_rec }}</span>
            <small class="text-muted ms-2 fst-italic">
              {{ formatDate(value.ngay_ct) }}</small
            >
          </div>
        </div>

        <!-- Price -->
        <div
          class="cart-price text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3"
        >
          <span class="d-lg-none fw-semibold">Vấn đề:</span>
          <div class="d-flex flex-column">
            <small class="text-danger">{{ defineVanDe(value) }}</small>
            <a
              @click="showModalCreateTicket = true"
              role="button"
              class="text-decoration-underline link-dark"
            >
              <small @click="ticketSelected = value">Chi tiết</small>
            </a>
          </div>
        </div>

        <div
          class="cart-total align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3"
        >
          <span class="d-lg-none fw-semibold">Trạng thái:</span>
          <div class="d-flex justify-content-end">
            <span class="text-lg-end">
              <span
                v-if="!value.ph_kn"
                class="badge bg-warning d-flex fw-normal align-items-center gap-1 bg-opacity-10 text-dark border border-warning"
              >
                <FolderClock :stroke-width="2" :size="16" />Đang xử lý
              </span>
              <span
                v-else
                class="badge bg-success d-flex fw-normal align-items-center gap-1 bg-opacity-10 text-dark border border-success"
              >
                <CheckCircle :stroke-width="2" :size="16" />Đã xử lý
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <SharedModulePagination :pagination="ticketList.pagination" />
      </div>
    </template>
    <div
      v-else
      class="d-flex w-100 flex-column align-items-center justify-content-center gap-2"
    >
      <UiEmpty />
      <h5 class="text-center text-capitalize">bạn chưa mở khiếu nại nào.</h5>
      <div>
        Vui lòng liên hệ nhân viên kinh doanh hoặc hotline
        <a
          href="tel:0963744567"
          target="_blank"
          class="font-semibold text-danger"
          >0963.74.4567</a
        >
        để được hỗ trợ.
      </div>
    </div>
  </LayoutAuth>

  <ClientOnly>
    <AuthModalCreateTicket
      :id="ticketSelected?.stt_rec || ''"
      :detailData="ticketSelected"
      v-if="ticketSelected?.stt_rec"
      @close="ticketSelected = null"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { BaseResponse, ProjectConfig } from "~/model";
import { subDays } from "date-fns";

definePageMeta({
  middleware: "auth",
});
const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Tài khoản", to: "/auth" },
  { label: "Hỗ trợ khách hàng" },
]);
const showModalCreateTicket = ref(false);
const { $appServices } = useNuxtApp();

const ticketSelected = ref<Record<string, any> | null>(null);

const params = ref<Record<string, any>>({
  PageIndex: 1,
  PageSize: 10,
  TuNgay: new Date(subDays(new Date(), 7)).toISOString().split("T")[0],
  DenNgay: new Date().toISOString().split("T")[0],
});
const DenNgay = ref(new Date());
const TuNgay = ref(subDays(new Date(), 7));

const ticketList = ref<BaseResponse<any>>();
const issueTypes = ref([
  { key: "hl_yn", label: "Hàng bị lỗi", checked: false },
  { key: "ktc_yn", label: "Không trả cước", checked: false },
  { key: "gnh_yn", label: "Giao nhầm hàng", checked: false },
  { key: "tth_yn", label: "Thừa thiếu hàng", checked: false },
  { key: "kng_yn", label: "Khiếu nại giá", checked: false },
  { key: "dthh_yn", label: "Đổi trả hàng hóa", checked: false },
  { key: "hdgkb_yn", label: "Hàng Date gần không báo", checked: false },
  { key: "vcc_yn", label: "Vận chuyển chậm", checked: false },
  { key: "vdk_yn", label: "Vấn đề khác", checked: false },
]);
async function getTicketList() {
  try {
    params.value.TuNgay = TuNgay.value.toISOString().split("T")[0];
    params.value.DenNgay = DenNgay.value.toISOString().split("T")[0];
    const response = await $appServices.order.listTicket(params.value);
    ticketList.value = response;
  } catch (error) {
    console.error("Error fetching ticket list:", error);
  }
}
onMounted(() => {
  getTicketList();
});

function defineVanDe(value: Record<string, any>) {
  if (!value) return "";
  const activeKeys = Object.keys(value).filter((key) => value[key] === true);
  const labels = issueTypes.value
    .filter((item) => activeKeys.includes(item.key))
    .map((item) => item.label);
  return labels.join(", ");
}
</script>

<style scoped>
.sticky-top {
  top: 80px;
  z-index: 0 !important;
}

@media screen and (min-width: 992px) {
  .w-custom {
    width: 70%;
  }
}
</style>
