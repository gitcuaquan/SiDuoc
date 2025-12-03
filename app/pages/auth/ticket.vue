<template>
  <LayoutAuth name="Hỗ trợ khách hàng" :breadcrumb="breadcrumb">
    <template>
      <div class="cart-header table-fake d-none border w-100 d-lg-table-row bg-light fw-semibold">
        <span class="d-lg-table-cell text-nowrap p-3 py-2">Mã Khiếu Nại</span>
        <span class="d-lg-table-cell text-nowrap p-3 py-2">Mã Đơn Hàng</span>
        <span class="d-lg-table-cell w-custom p-3 py-2">Vấn đề</span>
        <span class="d-lg-table-cell p-3 py-2 text-end text-nowrap">
          Trạng thái
        </span>
      </div>

      <!-- Item -->
      <div
        class="cart-item d-block border w-100 d-lg-table-row align-middle border rounded-3 p-3 mb-3 bg-white shadow-sm">
        <div
          class="cart-product mb-lg-0 mb-3 d-flex justify-content-between align-items-start gap-3 d-lg-table-cell p-lg-3">
          <span class="d-lg-none fw-semibold">Mã khiếu nại:</span>
          <div class="d-flex flex-column align-items-start">
            <span class="fw-medium ms-2">#KN009212</span>
            <small class="text-muted ms-2 fst-italic"> 22/01/2025</small>
          </div>
        </div>
        <div
          class="cart-product mb-lg-0 mb-3 d-flex justify-content-between align-items-start gap-3 d-lg-table-cell p-lg-3">
          <span class="d-lg-none fw-semibold">Mã Đơn Hàng:</span>
          <div class="d-flex flex-column align-items-start">
            <span class="fw-medium ms-2">#DH00123</span>
            <small class="text-muted ms-2 fst-italic">22/12/2024</small>
          </div>
        </div>

        <!-- Price -->
        <div
          class="cart-price text-lg-start d-flex mb-2 mb-lg-0 justify-content-between d-lg-table-cell align-middle p-lg-3">
          <span class="d-lg-none fw-semibold">Vấn đề:</span>
          <div class="d-flex flex-column">
            <small class="text-danger">Sản phẩm bị lỗi</small>
            <a @click="showModalCreateTicket = true" role="button" class="text-decoration-underline link-dark">
              <small>Chi tiết</small>
            </a>
          </div>
        </div>

        <div
          class="cart-total align-middle d-flex mb-2 text-lg-end mb-lg-0 justify-content-between d-lg-table-cell p-lg-3">
          <span class="d-lg-none fw-semibold">Trạng thái:</span>
          <div class="d-flex justify-content-end">
            <span class="text-lg-end">
              <span
                class="badge bg-warning d-flex fw-normal align-items-center gap-1 bg-opacity-10 text-dark border border-warning">
                <FolderClock :stroke-width="2" :size="16" />Đang xử lý
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <SharedModulePagination />
      </div>
    </template>
    <div class="d-flex w-100 flex-column align-items-center justify-content-center gap-2">
      <UiEmpty />
      <h5 class="text-center text-capitalize">bạn chưa mở khiếu nại nào.</h5>
      <div>Vui lòng liên hệ nhân viên kinh doanh hoặc hotline
        <a href="tel:0963744567" target="_blank" class="font-semibold text-danger">0963.74.4567</a> để được hỗ trợ.
      </div>
    </div>
  </LayoutAuth>

  <ClientOnly>
    <AuthModalCreateTicket :detail="true" v-if="showModalCreateTicket" @close="showModalCreateTicket = false" />
  </ClientOnly>
</template>

<script lang="ts" setup>
  import type { ProjectConfig } from "~/model";
  definePageMeta({
    middleware: "auth",
  });
  const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
    { label: "Tài khoản", to: "/auth" },
    { label: "Hỗ trợ khách hàng" },
  ]);
  const showModalCreateTicket = ref(false);
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
