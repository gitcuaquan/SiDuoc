<template>
  <div class="card bg-white overflow-hidden rounded-4 border-0 shadow-sm">
    <div class="ratio ratio-16x9">
      <img
        :src="news.thumbnail || '/images/image-error.svg'"
        class="object-fit-contain"
        :alt="news.title"
      />
    </div>
    <div class="card-body">
      <h6 class="card-title">
        {{ news.title }}
      </h6>
      <small class="card-text text-truncate-2">
        {{ news.seo_content }}
      </small>
      <nuxt-link
        :to="`/${props.category || 'news'}/${news.slug}`"
        class="stretched-link"
      >
        Chi tiết <MoveRight :size="16" />
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { News } from "~/model/news";

const props = defineProps<{
  news: News;
  category?: string;
}>();
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.02);
}
</style>
