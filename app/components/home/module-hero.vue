<template>
  <section class="hero mb-5 mb-lg-0">
    <div class="container overflow-hidden">
      <div class="row align-items-center pt-3 pt-lg-0">
        <!-- Left content -->
        <div
          class="col-lg-6 mb-5 position-relative mb-lg-0 text-lg-start text-center"
        >
          <!-- <h6 class="text-primary fw-bold mb-lg-5">Công Ty TapMed</h6> -->
          <h1 class="hero-title text-capitalize text-primary">
            Nhà Phân Phối Thuốc, Dược <br />
            Hàng Đầu Việt Nam
          </h1>
          <p class="hero-subtitle text-dark">
            Cung cấp mô hình nhập thuốc dễ dàng giải quyết vấn đề y tế một cách
            nhanh chóng và chất lượng. Cam kết về nguồn gốc sản phẩm và hiệu quả
            chi phí
          </p>
          <div
            class="d-flex align-items-center justify-content-lg-start justify-content-center"
          >
            <div class="avatar-group me-3">
              <div class="avatar overflow-hidden">
                <img
                  src="/images/avatar/av1.jpg"
                  class="w-100 object-fit-cover"
                  alt=""
                />
              </div>
              <div class="avatar overflow-hidden">
                <img
                  src="/images/avatar/av2.jpg"
                  class="w-100 object-fit-cover"
                  alt=""
                />
              </div>
              <div class="avatar overflow-hidden">
                <img
                  src="/images/avatar/av4.jpg"
                  class="w-100 object-fit-cover"
                  alt=""
                />
              </div>
              <!-- <div class="avatar overflow-hidden">
                  <img src="https://tapmed.vn/TapMedVn/images/av5.jpg" class="w-100 object-fit-cover" alt="" />
                </div> -->
            </div>
            <div>
              <div class="stat-number text-danger">5000+</div>
              <small class="text-primary">Khách hàng hài lòng</small>
            </div>
          </div>
        </div>
        <!-- Right image -->
        <div class="col-lg-6">
          <ClientOnly>
            <swiper-container
              class="swiper-cards"
              :slides-per-view="1"
              effect="cards"
              style="z-index: 0; max-width: 320px; margin: 0 auto"
              :grabCursor="true"
              :autoplay="{
                delay: 3000,
              }"
            >
              <swiper-slide
                v-for="(product, index) in listProduct?.getData"
                :key="`slide-card-${index}`"
                class="card position-relative border-0 shadow-sm"
              >
                <NuxtLink
                  :to="`/product/${product.ma_vt}`"
                  class="stretched-link"
                ></NuxtLink>
                <div class="ratio ratio-1x1">
                  <img
                    :src="
                      product.image_urls?.[0]?.url || '/images/image-error.svg'
                    "
                    class="card-img-top"
                    alt=""
                  />
                </div>
                <div class="card-body">
                  <small class="text-primary fw-bold"
                    >Giá bán : {{ formatCurrency(product.gia_nt2) }}</small
                  >
                  <div class="text-dark mb-2 mt-2 text-truncate-2">
                    {{ product.ten_vt }}
                  </div>
                </div>
              </swiper-slide>
            </swiper-container>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BaseResponse, type ITemsTapmed } from "~/model";

const { $appServices } = useNuxtApp();
const listProduct = ref<BaseResponse<ITemsTapmed>>();
const queryListTop = ref({
  PageIndex: 1,
  PageSize: 8,
  search: "",
  list_code: "TopProduct",
});

async function getProducts() {
  try {
    const rsData = await $appServices.items.productSuggest<any>(
      queryListTop.value,
    );
    listProduct.value = rsData;
  } catch (error) {
    console.error("Error fetching featured products:", error);
  }
}
// Không cần logic phức tạp, chỉ static UI
onBeforeMount(() => {
  getProducts();
});
</script>

<style scoped>
.hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  background: linear-gradient(
    180deg,
    rgba(var(--bs-primary-rgb), 0.6) 0%,
    #ffffff 100%
  );
  /* background-image: url('/images/hero-bg.jpg'); */
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 1px 2px 4px #ffffff;
}

.hero-subtitle {
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.avatar-group {
  display: flex;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #212529;
  margin-left: -10px;
  border: 2px solid #189847;
}

.stat-number {
  color: #ffdee2;
  /* hồng nhạt nổi bật */
  font-weight: 700;
  font-size: 1.25rem;
}

.hero-img {
  background-image: url("/images/hero-image.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 15px;
  min-height: 500px;
  position: relative;
}

@media screen and (max-width: 768px) {
  .hero-img {
    min-height: 300px;
    width: 100%;
  }

  .hero-title {
    font-size: 1.75rem;
  }
}

.bg-ovelay {
  z-index: -1;
  opacity: 0.3;
}
</style>
