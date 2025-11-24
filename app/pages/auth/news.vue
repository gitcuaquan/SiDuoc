<template>
  <LayoutAuth :breadcrumb="breadcrumb" name="Quản lý tin tức">
    <div class="row g-3">
      <div class="col-12">
        <div class="d-flex justify-content-end">
          <button class="btn btn-primary me-2" @click="showModal = true ">Thêm mới</button>
        </div>
      </div>
    </div>
  </LayoutAuth>
  <ClientOnly>
    <AuthModalActNews v-if="showModal" @close="showModal = false" />
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { ProjectConfig } from "~/model";
definePageMeta({
  middleware: "auth",
});

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Tài khoản", to: "/auth" },
  { label: "Quản lý tin tức" },
]);

const showModal = ref(false);

async function fetchNewsList() {
 try {
    const rsData = await $fetch("/api/post/list");
    console.log("🚀 ~ fetchNewsList ~ rsData:", rsData)
 } catch (error) {
    console.error("Error fetching news list:", error);
 }
}
onMounted(() => {
  fetchNewsList();
});
</script>

<style></style>
