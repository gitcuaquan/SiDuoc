<template>
  <ClientOnly>
    <swiper-container
      :pagination="{ clickable: true, currentClass: 'bg-primary' }"
      :autoplay="true"
      style="z-index: 0"
      ref="containerRef"
    >
      <swiper-slide
        v-for="(item, index) in listProduct?.getData"
        :key="index"
        class="p-2"
      >
        <div class="card border-0 h-100 shadow-sm mb-5">
          <div class="ratio ratio-1x1">
            <img
              :src="item.image_urls?.[0]?.url || '/images/image-error.svg'"
              class="card-img-top"
              alt="..."
            />
          </div>
          <div class="card-body">
            <small class="text-primary fst-italic"
              >Giá bán : {{ formatCurrency(item.gia_nt2) }}</small
            >
            <NuxtLink
              :to="`/product/${item.ma_vt}`"
              class="text-decoration-none text-dark"
            >
              <small class="text-truncate-2">
                {{ item.ten_vt }}
              </small>
            </NuxtLink>
          </div>
          <nuxt-link
            :to="`/product/${item.ma_vt}`"
            class="card-footer border-0 fw-normal text-decoration-none gap-2 bg-primary py-1 text-white d-flex justify-content-center align-items-center"
          >
            <ShoppingBag :size="16" /> Chi tiết
          </nuxt-link>
        </div>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script lang="ts" setup>
const containerRef = ref(null);

import {
  BaseResponse,
  type ITemsTapmed,
} from "~/model";

const { $appServices } = useNuxtApp();
const listProduct = ref<BaseResponse<ITemsTapmed>>();

const queryList = ref({
  PageIndex: 1,
  PageSize: 8,
  search: "",
});
const swiper = useSwiper(containerRef, {
  loop: true,
  grabCursor: true,
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  },
});

async function getProductSuggest() {
  try {
    const rsData = await $appServices.items.productSuggest<ITemsTapmed>(queryList.value);
    listProduct.value = rsData;
  } catch (error) {
    console.error("Error fetching product suggest:", error);
  }
}
onBeforeMount(() => {
 getProductSuggest();
});
</script>
<style>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  height: 42px;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
