<template>
  <div class="row g-3">
    <div class="col-md-4" v-for="value in listNews?.data" :key="value.id">
      <news-item :category="props.category" :news="value" />
    </div>
  </div>
  <slot :pagination="listNews?.meta" :loading="loading" :pageChanged="fetchNewsList">
  </slot>
</template>

<script lang="ts" setup>
  const props = defineProps({
    limit: {
      type: Number,
      default: 12,
    },
    page: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      default: "news",
    },
  });
  const listNews = ref<any>();
  const loading = ref(true);
  const queryList = ref({
    page: props.page,
    limit: props.limit,
    category: props.category,
    public: "true",
  });

  async function fetchNewsList() {
    loading.value = true;
    try {
      const rsData = await $fetch("/api/post/list", {
        query: {
          ...queryList.value,
        },
      });
      listNews.value = rsData;
    } catch (error) {
      console.error("Error fetching news list:", error);
    } finally {
      loading.value = false;
    }
  }
  onBeforeMount(() => {
    fetchNewsList();
  });
</script>

<style></style>
