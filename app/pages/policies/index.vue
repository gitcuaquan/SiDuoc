<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="container mx-autobg-white rounded-lg shadow-md">
    <div class="row pt-3 justify-content-center">
      <div class="col-lg-8">
        <div v-html="detail?.content" class="px-3 ql-editor"></div>
      </div>
      <div class="col-lg-4 border-md-left">
        <h5 class="mb-3">Các chương trình khuyến mãi</h5>
        <ul
          v-if="!relatedPending && relatedNews?.data?.length"
          class="list-group-flush ps-0 m-0 list-group"
        >
          <li
            v-for="value in relatedNews?.data"
            :key="value.slug"
            class="list-group-item ps-0"
          >
            <NuxtLink
              class="text-decoration-none"
              :to="`/promotion/${value.slug}`"
            >
              <div class="d-flex gap-2">
                <div
                  class="ratio flex-shrink-0 ratio-16x9 rounded overflow-hidden"
                  style="width: 100px"
                >
                  <img
                    :src="value.thumbnail || '/images/image-error.svg'"
                    alt="thumbnail"
                    class="object-fit-cover"
                  />
                </div>
                <small>{{ textTruncate(value.title, 50) }}</small>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import type { ProjectConfig } from "~/model";
import type { News } from "~/model/news";

const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
  { label: "Chính sách" },
]);
const { data: relatedNews, pending: relatedPending } = useFetch<{
  data: News[];
}>(`/api/post/list`, {
  query: {
    category: "promotion",
    page: 1,
    limit: 5,
  },
});

const { data: detail } = useFetch<News>(`/api/post/policy`);
</script>

<style></style>
