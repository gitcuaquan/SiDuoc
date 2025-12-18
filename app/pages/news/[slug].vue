<template>
  <SharedModuleBreadcrumb :data="breadcrumb" />
  <div class="py-5 container" :key="slug" v-show="!pending">
    <div class="row">
      <div class="col-12 col-lg-9">
        <h2 class="mb-3">
          {{ data?.title }}
        </h2>
        <div class="ratio ratio-16x9 rounded-5 overflow-hidden mb-4">
          <img alt="Si Dược Image" :src="data?.thumbnail || '/images/image-error.svg'" class="object-fit-cover" />
        </div>
        <div id="content">
          <div v-html="data?.content"></div>
        </div>
      </div>
      <div class="col-12 col-lg-3 border-md-left">
        <h5 class="mb-3">Bài viết liên quan</h5>
        <ul v-if="!relatedPending && relatedNews?.data?.length" class="list-group-flush ps-0 m-0 list-group">
          <li v-for="value in relatedNews?.data" :key="value.slug" class="list-group-item ps-0">
            <NuxtLink :to="`/news/${value.slug}`" class="text-decoration-none">
              <div class="d-flex align-items-center gap-2">
                <div class="ratio flex-shrink-0 ratio-16x9 rounded overflow-hidden" style="width: 100px">
                  <img :src="value.thumbnail || '/images/image-error.svg'" alt="thumbnail" class="object-fit-cover" />
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
  import type { ProjectConfig } from "~/model";
  import type { News } from "~/model/news";
  import "@vueup/vue-quill/dist/vue-quill.snow.css";
  const breadcrumb = ref<Array<ProjectConfig.BreadcrumbItem>>([
    { label: "Tin tức", to: "/news" },
    { label: "Chi tiết tin tức" },
  ]);

  const route = useRoute();

  // Keep slug reactive so fetch uses the current param on client navigation
  const slug = computed(() => String(route.params.slug ?? ""));

  // Use a key per-slug so cached results don't collide between different articles
  const { data, pending, error, refresh } = await useAsyncData(
    () => `detaill_news_${slug.value}`,
    async () => {
      if (!slug.value) return null;
      const newsDetail = await $fetch<News>(`/api/post/slug/${slug.value}`);
      return newsDetail;
    },
    {
      // also watch route param to re-run on client navigation
      watch: [() => route.params.slug],
    }
  );

  const { data: relatedNews, pending: relatedPending } = useFetch<{
    data: News[];
  }>(`/api/post/list`, {
    query: {
      category: data.value?.category || "",
      page: 1,
      limit: 5
    },
  });

  // SEO Meta Tags - Dynamic for News Detail Page
  useSeoMeta({
    title: () => `${data.value?.title || 'Bài viết'} | Sỉ Dược`,
    ogTitle: () => data.value?.title || 'Bài viết tin tức',
    description: () => data.value?.seo_content || 'Xem chi tiết bài viết từ Sỉ Dược',
    ogImage: () => data.value?.thumbnail || '/images/final-medial.png',
    ogImageAlt: () => data.value?.title || 'Bài viết',
    ogDescription: () => data.value?.seo_content || 'Xem chi tiết bài viết từ Sỉ Dược',
    keywords: () => data.value?.title
      ? `${data.value.title}, tin tức, sỉ dược, dược phẩm`
      : 'tin tức, bài viết, sỉ dược',
    author: 'Sỉ Dược',
    ogType: 'article',
  });
  // Schema.org Product Structured Data
useSchemaOrg({
  type: "Article",
  name: data.value?.title || "Bài viết",
  description: data.value?.seo_content || "Chi tiết bài viết từ Sỉ Dược",
  image: data.value?.thumbnail || "/images/final-medial.png",
  author: {
    "@type": "Organization",
    name: "Sỉ Dược",
  },
  headline: data.value?.title || "Bài viết",
  datePublished: data.value?.created_at || "",
  dateModified: data.value?.updated_at || "",
});
</script>

<style></style>
