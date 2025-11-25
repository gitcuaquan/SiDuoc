<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />

  <div class="container py-3">
    <h5 class="my-3">Tin tức nổi bật</h5>
    <news-list :limit="12" category="promotion" :page="page">
      <template #default="{ pagination, loading }">
        <div
          class="d-flex justify-content-center min-vh-100 align-items-center my-4"
          v-if="loading"
        >
          <UiLoading />
        </div>
        <div class="d-flex justify-content-end my-4" v-else-if="pagination">
          <SharedModulePagination
            :pagination="pagination"
            @page-change="page = $event"
          />
        </div>
      </template>
    </news-list>
  </div>
</template>

<script lang="ts" setup>
import type { ProjectConfig } from "~/model";

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Khuyến mãi" },
]);

interface Promotion {
  id: number;
  title: string;
  description: string;
  expiry: string;
}
const page = ref(1);
const promotions = ref<Promotion[]>([
  {
    id: 1,
    title: "Giảm giá 20% cho đơn hàng đầu tiên",
    description:
      "Áp dụng cho tất cả sản phẩm. Không giới hạn giá trị đơn hàng.",
    expiry: "30/09/2025",
  },
  {
    id: 2,
    title: "Mua 2 tặng 1",
    description: "Chỉ áp dụng cho sản phẩm thuộc danh mục chăm sóc sức khỏe.",
    expiry: "15/10/2025",
  },
  {
    id: 3,
    title: "Freeship toàn quốc",
    description: "Miễn phí vận chuyển cho đơn hàng từ 500.000đ.",
    expiry: "31/12/2025",
  },
]);
</script>

<style>
.promotion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
}
.promotion-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 20px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.promotion-card h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #1976d2;
}
.promotion-card p {
  margin: 0 0 8px 0;
  color: #333;
}
.promotion-expiry {
  font-size: 14px;
  color: #888;
  margin-top: auto;
}
</style>
