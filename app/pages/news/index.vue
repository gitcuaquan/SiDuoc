<template>
  <shared-module-breadcrumb :data="breadcrumb" />
  <div class="container mt-3">
    <news-list :limit="12" :page="page">
      <template #default="{ pagination, loading }">
        <div class="d-flex min-vh-100 justify-content-center align-items-center my-4" v-if="loading">
          <UiLoading />
        </div>
        <div class="d-flex justify-content-end my-4" v-else-if="pagination">
          <SharedModulePagination :pagination="pagination" @page-change="page = $event" />
        </div>
      </template>
    </news-list>
  </div>
</template>

<script lang="ts" setup>
  import type { ProjectConfig } from "~/model";

  // SEO Meta Tags for News List Page
  useSeoMeta({
    title: 'Tin tức - Sỉ Dược',
    description: 'Cập nhật tin tức mới nhất, bài viết hữu ích về dược phẩm, vitamin, thực phẩm chức năng từ Sỉ Dược.',
    ogTitle: 'Tin tức - Sỉ Dược',
    ogDescription: 'Đọc những bài viết hữu ích, tin tức mới nhất về dược phẩm, sức khỏe từ Sỉ Dược.',
    ogImage: '/images/final-medial.png',
    ogImageAlt: 'Tin tức Sỉ Dược',
    keywords: 'tin tức, dược phẩm, vitamin, sức khỏe, thực phẩm chức năng',
  })

  const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
    { label: "Tin tức" },
  ]);

  const page = ref(1);
</script>

<style></style>
