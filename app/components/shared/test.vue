<template>
  <ClientOnly>
    <swiper-container class="swiper-cards" :slides-per-view="1" effect="cards" style="z-index: 0" :grabCursor="true"
      :autoplay="{
        delay: 3000,
      }">
      <swiper-slide v-for="(product, index) in listProduct" :key="`slide-card-${index}`"
        class="card position-relative border-0 shadow-sm">
        <NuxtLink :to="`/product/${product.ma_vt}`" class="stretched-link"></NuxtLink>
        <div class="ratio ratio-1x1">
          <img :src="product.image_urls?.[0]?.url || '/images/image-error.svg'" class="card-img-top" alt="" />
        </div>
        <div class="card-body">
          <small class="text-primary fst-italic">Giá bán : {{ formatCurrency(product.gia_nt2) }}</small>
          <div class="text-dark mb-2 text-truncate-2">
            {{ product.ten_vt }}
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script setup lang="ts">
import {
  BodyFilter,
  FilterItem,
  OperatorType,
  type ITemsTapmed,
} from "~/model";

const { $appServices } = useNuxtApp();
const listProduct = ref<ITemsTapmed[]>([]);
const filterListProduct = ref(
  new BodyFilter<ITemsTapmed>({
    pageIndex: 1,
    pageSize: 10,
    filters: [
      new FilterItem<ITemsTapmed>({
        filterValue: "ten_vt",
        operatorType: OperatorType.Contains,
        valueSearch: "",
      }),
      new FilterItem<ITemsTapmed>({
        filterValue: "ten_nhasanxuat",
        operatorType: OperatorType.Contains,
        valueSearch: "",
      }),
    ],
  })
);
async function getProducts() {
  try {
    const products = await $appServices.items.getItems(filterListProduct.value);
    listProduct.value = products.getData;
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }
}
// Không cần logic phức tạp, chỉ static UI
onBeforeMount(() => {
  getProducts();
});
</script>
<style>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.swiper-cards {
  width: 290px;
  height: 390px;
}

@media screen and (min-width: 768px) {
  .swiper-cards {
    width: 450px;
    height: 550px;
  }
}

.swiper-cards swiper-slide {
  border-radius: 6px;
  border: 1px solid black;
}
</style>
