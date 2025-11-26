<template>
  <div class="row g-2" v-if="!loading && listNews?.data.length > 0">
    <div class="col-lg-8 position-relative" v-if="listNews?.data[0]">
      <NuxtLink
        class="stretched-link"
        :to="`/${listNews.data?.[0]?.category}/${listNews?.data[0]?.slug}`"
      ></NuxtLink>
      <div id="big-image" class="img-item">
        <img
          :src="listNews?.data[0]?.thumbnail"
          :alt="listNews?.data[0]?.title"
          class="img-fluid w-100"
        />
      </div>
    </div>
    <div class="col-lg-4">
      <div class="row g-2">
        <div class="col-12 position-relative" v-if="listNews?.data[1]">
          <NuxtLink
            class="stretched-link"
            :to="`/${listNews.data?.[1]?.category}/${listNews?.data[1]?.slug}`"
          ></NuxtLink>
          <div class="img-item">
            <img
              :src="listNews?.data[1]?.thumbnail"
              :alt="listNews?.data[1]?.title"
              class="obj-fit-cover w-100"
            />
          </div>
        </div>
        <div class="col-12 position-relative" v-if="listNews?.data[2]">
          <NuxtLink
            class="stretched-link"
            :to="`/${listNews.data?.[2]?.category}/${listNews?.data[2]?.slug}`"
          ></NuxtLink>
          <div class="img-item">
            <img
              :src="listNews?.data[2]?.thumbnail"
              :alt="listNews?.data[2]?.title"
              class="obj-fit-cover w-100"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const loading = ref(true);
const listNews = ref<any>();
const queryList = ref({
  page: 1,
  limit: 3,
  keyword: "",
  show_in_home: "true",
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

<style scoped>
.img-item img {
  height: 210px;
  border-radius: 8px;
  overflow: hidden;
}
@media screen and (min-width: 992px) {
  .img-item img {
    height: 220px;
  }
  #big-image img {
    height: 448px !important;
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>
