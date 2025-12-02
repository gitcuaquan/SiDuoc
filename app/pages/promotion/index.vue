<template>
  <shared-module-breadcrumb :data="breadcrumb" />
  <div class="container mt-3">
    <news-list :category="'promotion'" :limit="12"  :page="page">
      <template #default="{ pagination, loading }">
        <div
          class="d-flex min-vh-100 justify-content-center align-items-center my-4"
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

// SEO Meta Tags for Promotion List Page
useSeoMeta({
  title: 'Khuyến mãi - Sỉ Dược',
  description: 'Cập nhật các chương trình khuyến mãi, ưu đãi mới nhất từ Sỉ Dược. Giá sỉ hấp dẫn cho dược phẩm, vitamin, thực phẩm chức năng.',
  ogTitle: 'Khuyến mãi - Sỉ Dược',
  ogDescription: 'Đón chào những ưu đãi và khuyến mãi hấp dẫn từ Sỉ Dược dành cho khách hàng.',
  ogImage: '/images/media.jpg',
  ogImageAlt: 'Khuyến mãi Sỉ Dược',
  keywords: 'khuyến mãi, ưu đãi, sỉ dược, dược phẩm, giá sỉ',
})

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Khuyến mãi" },
]);

const page = ref(1);

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
