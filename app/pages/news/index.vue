<template>
  <shared-module-breadcrumb :data="breadcrumb" />
  <div class="container mt-3">
    <news-list :limit="12"  :page="page">
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

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Tin tức" },
]);

const page = ref(1);
</script>

<style></style>
